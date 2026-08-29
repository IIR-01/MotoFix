const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueCategory: {
      type: String,
      enum: ['Flat Tire', 'Battery Failure', 'Engine Trouble', 'Other'],
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    // Full lifecycle defined here even though Module 2 only ever creates
    // 'Pending' requests — Module 3's Vendor Request Dashboard updates the
    // rest of these on the same Request documents.
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'En Route', 'Completed', 'Cancelled'],
      default: 'Pending',
    },

    // Set once the customer picks a mechanic from the ranked candidate
    // list. Reset to null if that mechanic rejects, so the customer can
    // pick someone else without the request being stuck.
    targetVendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Only settable once, only after status is 'Completed'.
    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);