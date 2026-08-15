const mongoose = require('mongoose');

const CUSTOMIZATION_CATEGORIES = ['paint_color', 'rims', 'spoiler', 'body_kit', 'brake_caliper', 'decals'];

const vehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    bodyType: { type: String, required: true },
    baseImageUrl: { type: String, required: true },
    customizationCategories: {
      type: [String],
      enum: CUSTOMIZATION_CATEGORIES,
      default: [],
    },
  },
  { timestamps: true }
);

vehicleSchema.index({ make: 1, model: 1, year: 1 }, { unique: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
Vehicle.CUSTOMIZATION_CATEGORIES = CUSTOMIZATION_CATEGORIES;

module.exports = Vehicle;
