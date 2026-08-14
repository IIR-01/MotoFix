const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceName: { type: String, required: true },
    description: { type: String, default: '' },
    basePrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
