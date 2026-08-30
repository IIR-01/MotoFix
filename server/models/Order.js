const mongoose = require('mongoose');

// Snapshot of a Part at purchase time — name/price/vendorName are copied in
// rather than just referenced, so an order's receipt stays accurate even if
// the vendor later edits or removes the listing.
const orderItemSchema = new mongoose.Schema(
  {
    part: { type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    vendorName: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Reuses the SSLCommerz tran_id as a human-readable order reference —
    // it's already unique and generated at checkout, see paymentController.
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, default: '' },
    // Orders only ever get created after a successful payment (see
    // paymentController.completePayment), so this starts at 'Processing'
    // rather than needing a separate payment-status field.
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    tranId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
