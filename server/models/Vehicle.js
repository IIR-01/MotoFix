const mongoose = require('mongoose');

// Reference data for the cascading make -> model -> year dropdowns on the
// customer-facing Compatible Parts Search feature (Module 1, Hafizur).
const vehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

vehicleSchema.index({ make: 1, model: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
