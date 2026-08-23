require('dotenv').config();
const mongoose = require('mongoose');
const CustomizationOption = require('./models/CustomizationOption');

const BRAKE_CALIPER_COLORS = [
  { key: 'stock', label: 'Stock Gray', colorHex: '#9CA3AF' },
  { key: 'red', label: 'Red', colorHex: '#DC2626' },
  { key: 'yellow', label: 'Yellow', colorHex: '#FACC15' },
  { key: 'blue', label: 'Blue', colorHex: '#2563EB' },
];

const RIM_STYLES = [
  { key: 'stock', label: 'Stock Rims' },
  { key: 'sport', label: 'Sport 5-Spoke' },
  { key: 'alloy', label: 'Deep Dish Alloy' },
];

const SPOILER_STYLES = [
  { key: 'none', label: 'No Spoiler' },
  { key: 'lip', label: 'Lip Spoiler' },
  { key: 'wing', label: 'GT Wing' },
];

const BODY_KIT_STYLES = [
  { key: 'none', label: 'Stock' },
  { key: 'sport', label: 'Sport Kit' },
  { key: 'wide', label: 'Wide Kit' },
];

const DECAL_STYLES = [
  { key: 'none', label: 'No Decals' },
  { key: 'stripes', label: 'Racing Stripes' },
  { key: 'tribal', label: 'Tribal Graphics' },
];

const CATEGORY_SETS = {
  brake_caliper: BRAKE_CALIPER_COLORS,
  rims: RIM_STYLES,
  spoiler: SPOILER_STYLES,
  body_kit: BODY_KIT_STYLES,
  decals: DECAL_STYLES,
};

const OPTIONS = [];
for (const bodyType of CustomizationOption.BODY_TYPES) {
  for (const [category, list] of Object.entries(CATEGORY_SETS)) {
    list.forEach((opt, index) => {
      OPTIONS.push({ bodyType, category, order: index, ...opt });
    });
  }
}

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // paint_color is no longer generic per-bodyType data — it now comes from
  // each vehicle's own real photoOptions.paint_color, so drop any old seeded entries.
  await CustomizationOption.deleteMany({ category: 'paint_color' });

  for (const opt of OPTIONS) {
    await CustomizationOption.findOneAndUpdate(
      { bodyType: opt.bodyType, category: opt.category, key: opt.key },
      opt,
      { upsert: true }
    );
  }

  console.log(`Seeded ${OPTIONS.length} customization options.`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
