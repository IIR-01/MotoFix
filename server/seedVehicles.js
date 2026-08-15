require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

const CIVIC_TYPE_R_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/8/85/The_frontview_of_Honda_CIVIC_TYPE_R_%28FL5%29.jpg';
const CBR150R_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/b/b7/2021_Honda_CBR150R_ABS.jpg';
const R15_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Yamaha_R15_V3.0.jpg';
const COROLLA_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/61/Toyota_Corolla_2.0_XEi_2022.jpg';
const CB_HORNET_160R_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/2/20/2017_Honda_CB_Hornet_160R_-_Howrah_20170610103542.jpg';
const GIXXER_SF_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/7/78/2021_Suzuki_Gixxer_SF_250_100th_Anniversary_MotoGP_Edition_02.jpg';
const FZS_FI_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/3/33/YAMAHA_FZ-S.jpg';

const VEHICLES = [
  {
    make: 'Honda',
    model: 'Civic Type R',
    year: 2023,
    bodyType: 'Hatchback',
    baseImageUrl: CIVIC_TYPE_R_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'spoiler', 'body_kit', 'brake_caliper', 'decals'],
  },
  {
    make: 'Honda',
    model: 'Civic Type R',
    year: 2020,
    bodyType: 'Hatchback',
    baseImageUrl: CIVIC_TYPE_R_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'decals'],
  },
  {
    make: 'Honda',
    model: 'CBR150R',
    year: 2019,
    bodyType: 'Motorbike',
    baseImageUrl: CBR150R_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'decals'],
  },
  {
    make: 'Yamaha',
    model: 'R15',
    year: 2021,
    bodyType: 'Motorbike',
    baseImageUrl: R15_IMAGE,
    customizationCategories: ['paint_color', 'body_kit', 'decals'],
  },
  {
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    bodyType: 'Sedan',
    baseImageUrl: COROLLA_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'spoiler', 'decals'],
  },
  {
    make: 'Honda',
    model: 'CB Hornet 160R',
    year: 2021,
    bodyType: 'Motorbike',
    baseImageUrl: CB_HORNET_160R_IMAGE,
    customizationCategories: ['paint_color', 'decals'],
  },
  {
    make: 'Honda',
    model: 'CBR150R',
    year: 2020,
    bodyType: 'Motorbike',
    baseImageUrl: CBR150R_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'decals'],
  },
  {
    make: 'Honda',
    model: 'CBR150R',
    year: 2022,
    bodyType: 'Motorbike',
    baseImageUrl: CBR150R_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'decals'],
  },
  {
    make: 'Suzuki',
    model: 'Gixxer SF',
    year: 2021,
    bodyType: 'Motorbike',
    baseImageUrl: GIXXER_SF_IMAGE,
    customizationCategories: ['paint_color', 'decals'],
  },
  {
    make: 'Yamaha',
    model: 'FZS FI',
    year: 2021,
    bodyType: 'Motorbike',
    baseImageUrl: FZS_FI_IMAGE,
    customizationCategories: ['paint_color', 'decals'],
  },
  {
    make: 'Yamaha',
    model: 'R15 V3',
    year: 2020,
    bodyType: 'Motorbike',
    baseImageUrl: R15_IMAGE,
    customizationCategories: ['paint_color', 'body_kit', 'decals'],
  },
  {
    make: 'Yamaha',
    model: 'R15 V3',
    year: 2022,
    bodyType: 'Motorbike',
    baseImageUrl: R15_IMAGE,
    customizationCategories: ['paint_color', 'body_kit', 'decals'],
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const vehicle of VEHICLES) {
    await Vehicle.findOneAndUpdate(
      { make: vehicle.make, model: vehicle.model, year: vehicle.year },
      vehicle,
      { upsert: true }
    );
  }

  console.log(`Seeded ${VEHICLES.length} vehicle configs.`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
