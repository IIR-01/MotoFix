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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);