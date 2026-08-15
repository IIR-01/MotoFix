// Run once with: node seedParts.js
// Seeds a handful of vehicles and compatible parts so the Compatible Parts
// Search feature has something to show. Safe to run multiple times — it
// skips creating duplicates for vehicles/parts that already exist by name.
require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const Part = require('./models/Part');

const VEHICLES = [
  { make: 'Honda', model: 'CBR150R', year: 2020 },
  { make: 'Honda', model: 'CITY', year: 2020 },
  { make: 'Honda', model: 'CITY', year: 2022 },
  { make: 'Mitsubisi', model: 'LANCHER', year: 2017 },
  { make: 'Honda', model: 'CBR150R', year: 2022 },
  { make: 'Honda', model: 'CB Hornet 160R', year: 2021 },
  { make: 'Yamaha', model: 'R15 V3', year: 2020 },
  { make: 'Yamaha', model: 'R15 V3', year: 2022 },
  { make: 'Yamaha', model: 'FZS FI', year: 2021 },
  { make: 'Suzuki', model: 'Gixxer SF', year: 2021 },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const vehicles = {};
  for (const v of VEHICLES) {
    const vehicle = await Vehicle.findOneAndUpdate(v, v, { upsert: true, returnDocument: 'after' });
    vehicles[`${v.make}|${v.model}|${v.year}`] = vehicle;
  }

  const key = (make, model, year) => vehicles[`${make}|${model}|${year}`]._id;

  const PARTS = [
    {
      name: 'Front Brake Pad Set',
      category: 'brakes',
      price: 850,
      imageUrl: '/images/parts/cbr150r_front_brake_pad.jpg',
      compatibleVehicles: [
        key('Honda', 'CBR150R', 2020),
        key('Honda', 'CBR150R', 2022),
      ],
    },
    {
      name: 'CarbonFiber_HOOD',
      category: 'body',
      price: 111999,
      imageUrl: '/images/parts/mitsubishi_lancher_2017_carbonfiberhood.webp',
      compatibleVehicles: [
        key('Mitsubisi', 'LANCHER', 2017),
        
      ],
    },
    {
      name: 'Chain & Sprocket Kit',
      category: 'drivetrain',
      price: 2400,
      imageUrl: '/images/parts/cbr_chain_sprocket.jpeg',
      compatibleVehicles: [
        key('Honda', 'CBR150R', 2020),
        key('Honda', 'CBR150R', 2022),
        key('Honda', 'CB Hornet 160R', 2021),
      ],
    },
    {
      name: 'Air Filter',
      category: 'engine',
      price: 450,
      imageUrl: '/images/parts/v3_airfilter.jpg', 
      compatibleVehicles: [
        key('Yamaha', 'R15 V3', 2020),
        key('Yamaha', 'R15 V3', 2022),
      ],
    },
    {
      name: 'Rear Shock Absorber',
      category: 'suspension',
      price: 3200,
      imageUrl: '/images/parts/yamaha-r15-v3-shock-absorber.jpeg', // no photo yet
      compatibleVehicles: [key('Yamaha', 'R15 V3', 2022)],
    },
    {
      name: 'Clutch Plate Set',
      category: 'drivetrain',
      price: 1600,
      imageUrl: '', // no photo yet
      compatibleVehicles: [key('Yamaha', 'FZS FI', 2021)],
    },
    {
      name: 'Headlight Assembly',
      category: 'electrical',
      price: 2100,
      imageUrl: '/images/parts/gixxer_headlight.jpg',
      compatibleVehicles: [key('Suzuki', 'Gixxer SF', 2021)],
    },
  ];

  for (const p of PARTS) {
    await Part.findOneAndUpdate({ name: p.name }, p, { upsert: true });
  }

  console.log(`Seeded ${VEHICLES.length} vehicles and ${PARTS.length} parts.`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
