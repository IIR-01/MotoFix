const mongoose = require('mongoose');

// One record per SSLCommerz session (real or, for now, simulated — see
// services/sslcommerzService.js). Two things pay through this: a customer's
// order checkout, and a vendor's one-time listing fee at registration.
//
// Neither target exists yet when the session is created — an Order is only
// created after payment succeeds (so a failed/abandoned payment never leaves
// a half-placed order behind), and a vendor account is only created after
// their listing fee clears (so an unpaid signup never leaves a dangling
// account). `meta` holds whatever's needed to finish that job on success —
// the cart snapshot, or the registration form (password already hashed).
const paymentSchema = new mongoose.Schema(
  {
    tranId: { type: String, required: true, unique: true },
    purpose: { type: String, enum: ['order', 'vendor_listing_fee'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
