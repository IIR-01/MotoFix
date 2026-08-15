const mongoose = require('mongoose');

const partSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    compatibleVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Part', partSchema);
