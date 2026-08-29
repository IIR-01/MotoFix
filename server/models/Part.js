const mongoose = require('mongoose');

const partSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ['engine', 'brakes', 'drivetrain', 'suspension', 'electrical', 'body'],
    },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    // Units currently on hand. 0 means the listing shows an "Out of Stock" label.
    stock: { type: Number, required: true, default: 0 },
    vendorName: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    compatibleVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Part', partSchema);
