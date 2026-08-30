const Order = require('../models/Order');
const User = require('../models/User');

// GET /api/orders  (customer — their own order history)
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ customer: req.user.id }).sort('-createdAt');
  res.json(orders);
};

// GET /api/orders/:id  (customer — their own order's detail breakdown)
exports.getOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customer: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

// PATCH /api/orders/:id/status  (vendor)
// Parts aren't linked to a vendor account by ID (Part.vendorName is a plain
// string set at listing time), so a vendor can update status on any order
// that contains at least one item carrying their own businessName.
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const vendor = await User.findById(req.user.id);
  const order = await Order.findOne({ _id: req.params.id, 'items.vendorName': vendor.businessName });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status;
  await order.save();
  res.json(order);
};
