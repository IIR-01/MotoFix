const mongoose = require('mongoose');

const CATEGORIES = ['paint_color', 'rims', 'spoiler', 'body_kit', 'brake_caliper', 'decals'];
const BODY_TYPES = ['Hatchback', 'Sedan', 'Motorbike'];

const customizationOptionSchema = new mongoose.Schema(
  {
    bodyType: { type: String, enum: BODY_TYPES, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    key: { type: String, required: true },
    label: { type: String, required: true },
    colorHex: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

customizationOptionSchema.index({ bodyType: 1, category: 1, key: 1 }, { unique: true });

const CustomizationOption = mongoose.model('CustomizationOption', customizationOptionSchema);
CustomizationOption.CATEGORIES = CATEGORIES;
CustomizationOption.BODY_TYPES = BODY_TYPES;

module.exports = CustomizationOption;
