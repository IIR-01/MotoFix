const mongoose = require('mongoose');

// Shared reference data: powers the cascading make -> model -> year dropdowns
// on the Compatible Parts Search feature (Module 1, Hafizur) as well as the
// vehicle customization picker (Module 1, Shihab). Not every vehicle needs
// every field — a parts-search-only entry can skip bodyType/baseImageUrl.
const CUSTOMIZATION_CATEGORIES = ['paint_color', 'rims', 'spoiler', 'body_kit', 'brake_caliper', 'decals'];

const vehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    bodyType: { type: String },
    baseImageUrl: { type: String },
    customizationCategories: {
      type: [String],
      enum: CUSTOMIZATION_CATEGORIES,
      default: [],
    },
    // Real photos of this exact vehicle for specific option picks, keyed by
    // category — e.g. { paint_color: [{key:'red', label:'Red', imageUrl}],
    // decals: [{key:'tribal', label:'Tribal Graphics', imageUrl}] }. Only
    // populated where a real photo actually exists; baseImageUrl is always
    // the implicit "stock/no change" option for every category.
    photoOptions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Full replacement of a category's option list for this vehicle, keyed
    // by category — e.g. { rims: [{key:'black_and_white', label:'Black and
    // White', imageUrl}] } shows ONLY that option instead of the shared
    // bodyType option set (unlike photoOptions, which layers photos onto
    // the existing shared list without removing anything).
    optionOverrides: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

vehicleSchema.index({ make: 1, model: 1, year: 1 }, { unique: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
Vehicle.CUSTOMIZATION_CATEGORIES = CUSTOMIZATION_CATEGORIES;

module.exports = Vehicle;
