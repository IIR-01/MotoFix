const bcrypt = require('bcryptjs');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Part = require('../models/Part');
const User = require('../models/User');
const { generateTranId, buildGatewayUrl } = require('../services/sslcommerzService');

const DELIVERY_CHARGE = 60;
const VENDOR_LISTING_FEE = 2000;

// POST /api/payments/order/init  (customer)
// Validates the cart against the DB (never trust client-supplied prices or
// stock) and opens a payment session for it. The order itself isn't created
// yet — only once the payment actually succeeds (see completePayment) — so
// an abandoned or failed checkout never leaves a half-placed order behind,
// and the customer's cart naturally survives untouched for a retry.
exports.initOrderPayment = async (req, res) => {
  const { items, deliveryAddress } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty' });
  }

  const lineItems = [];
  let subtotal = 0;
  for (const { partId, quantity } of items) {
    const qty = Number(quantity);
    if (!partId || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: 'Invalid cart item' });
    }
    const part = await Part.findById(partId);
    if (!part) {
      return res.status(404).json({ message: 'One of the items in your cart no longer exists' });
    }
    if (part.stock < qty) {
      return res.status(400).json({ message: `Only ${part.stock} left of "${part.name}"` });
    }
    lineItems.push({
      part: part._id,
      name: part.name,
      price: part.price,
      quantity: qty,
      vendorName: part.vendorName,
    });
    subtotal += part.price * qty;
  }

  const deliveryCharge = DELIVERY_CHARGE;
  const totalAmount = subtotal + deliveryCharge;
  const tranId = generateTranId('ORD');

  await Payment.create({
    tranId,
    purpose: 'order',
    amount: totalAmount,
    user: req.user.id,
    meta: { items: lineItems, subtotal, deliveryCharge, totalAmount, deliveryAddress: deliveryAddress || '' },
  });

  res.status(201).json({ tranId, gatewayUrl: buildGatewayUrl(tranId), amount: totalAmount });
};

// POST /api/payments/vendor-listing-fee/init  (public — runs before the
// vendor account exists at all)
// Mirrors POST /api/auth/register's validation for the vendor branch, but
// holds the account in escrow (hashed password included) inside the
// Payment's meta until the one-time listing fee actually clears.
exports.initVendorListingFeePayment = async (req, res) => {
  const { name, email, phone, password, businessName, address, serviceCategory, tradeLicense, location } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  if (!name || !email || !phone || !businessName || !address || !serviceCategory || !tradeLicense) {
    return res.status(400).json({ message: 'All business details are required' });
  }
  // Mirrors authController.register's mechanic-center location requirement
  // (Raad's Nearby Mechanic Locator feature) — this flow creates the vendor
  // account instead of that endpoint, so it has to enforce the same rule.
  if (
    serviceCategory === 'mechanic_center' &&
    (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number')
  ) {
    return res.status(400).json({ message: 'Shop location is required for mechanic centers' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'An account with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const tranId = generateTranId('VLF');

  await Payment.create({
    tranId,
    purpose: 'vendor_listing_fee',
    amount: VENDOR_LISTING_FEE,
    meta: { name, email, phone, password: hashedPassword, businessName, address, serviceCategory, tradeLicense, location },
  });

  res.status(201).json({ tranId, gatewayUrl: buildGatewayUrl(tranId), amount: VENDOR_LISTING_FEE });
};

// GET /api/payments/:tranId  (public)
// Has to be public: the dummy gateway page loads this before the customer
// has a token in the vendor-listing-fee case, exactly like a real
// SSLCommerz hosted page would look up a session with no MotoFix login of
// its own. Only ever returns the non-sensitive summary a checkout page
// needs — never the escrowed registration payload or cart contents.
exports.getPayment = async (req, res) => {
  const payment = await Payment.findOne({ tranId: req.params.tranId });
  if (!payment) return res.status(404).json({ message: 'Payment session not found' });
  res.json({
    tranId: payment.tranId,
    purpose: payment.purpose,
    amount: payment.amount,
    status: payment.status,
  });
};

// POST /api/payments/:tranId/complete  { result: 'success' | 'fail' }  (public)
// Stands in for SSLCommerz's success/fail redirect + IPN callback. This is
// the one place that finalizes a purpose: creates the Order, or creates the
// vendor account, only once payment has actually gone through.
exports.completePayment = async (req, res) => {
  const { result } = req.body;
  if (!['success', 'fail'].includes(result)) {
    return res.status(400).json({ message: 'result must be "success" or "fail"' });
  }

  const payment = await Payment.findOne({ tranId: req.params.tranId });
  if (!payment) return res.status(404).json({ message: 'Payment session not found' });
  if (payment.status !== 'pending') {
    return res.status(400).json({ message: `This payment session was already ${payment.status}` });
  }

  if (result === 'fail') {
    payment.status = 'failed';
    await payment.save();
    return res.json({ status: 'failed' });
  }

  if (payment.purpose === 'order') {
    const { items, subtotal, deliveryCharge, totalAmount, deliveryAddress } = payment.meta;

    // Re-check stock at the moment of "capture" — it may have sold out
    // between checkout and the customer finishing payment. Each update is
    // conditioned on there still being enough stock, so this can't oversell
    // under concurrent checkouts.
    const decremented = [];
    for (const item of items) {
      const updated = await Part.findOneAndUpdate(
        { _id: item.part, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (!updated) {
        // Roll back any earlier decrements from this same order before failing it.
        for (const done of decremented) {
          await Part.findByIdAndUpdate(done.part, { $inc: { stock: done.quantity } });
        }
        payment.status = 'failed';
        await payment.save();
        return res.status(409).json({
          message: `"${item.name}" sold out before payment could be completed. You have not been charged.`,
        });
      }
      decremented.push(item);
    }

    const order = await Order.create({
      orderNumber: payment.tranId,
      customer: payment.user,
      items,
      subtotal,
      deliveryCharge,
      totalAmount,
      deliveryAddress,
      tranId: payment.tranId,
    });

    payment.status = 'success';
    payment.order = order._id;
    await payment.save();

    // No email service is wired up in this project yet — this stands in
    // for the confirmation receipt described in the spec until one is.
    console.log(`[MotoFix] Order confirmation receipt for ${order.orderNumber} would be emailed here.`);

    return res.json({ status: 'success', order });
  }

  // purpose === 'vendor_listing_fee'
  const { name, email, phone, password, businessName, address, serviceCategory, tradeLicense, location } = payment.meta;

  const existing = await User.findOne({ email });
  if (existing) {
    payment.status = 'failed';
    await payment.save();
    return res.status(400).json({ message: 'An account with this email was registered while payment was in progress' });
  }

  const userData = {
    name,
    email,
    phone,
    password,
    role: 'vendor',
    businessName,
    address,
    serviceCategory,
    tradeLicense,
    listingFeePaid: true,
  };
  if (serviceCategory === 'mechanic_center') {
    // GeoJSON requires [lng, lat] order — matches authController.register's
    // conversion for the same field.
    userData.location = { type: 'Point', coordinates: [location.lng, location.lat] };
  }

  const user = await User.create(userData);

  payment.status = 'success';
  payment.user = user._id;
  await payment.save();

  console.log(`[MotoFix] Vendor listing fee receipt for ${email} would be emailed here.`);

  return res.json({
    status: 'success',
    message: 'Listing fee paid. Registered — your application is pending verification.',
  });
};
