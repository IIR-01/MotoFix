require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

const CIVIC_TYPE_R_FL5_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/8/85/The_frontview_of_Honda_CIVIC_TYPE_R_%28FL5%29.jpg';
const CIVIC_TYPE_R_FL5_BLUE_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/6/62/2024_Honda_Civic_Type_R_in_Racing_Blue%2C_front_right.jpg';
const CIVIC_TYPE_R_FL5_WHITE_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/a/a6/2024_Honda_Civic_Type_R_FL5_in_Championship_White%2C_front_left%2C_06-30-2024.jpg';
const CIVIC_TYPE_R_FK8_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/6/6a/Honda_Civic_Type_R_FK8_facelift.jpg';
const CIVIC_TYPE_R_FK8_RED_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/8/8c/Honda_Civic_Type_R_FK8_Rallye_Red_01.jpg';
const CIVIC_TYPE_R_FK8_WHITE_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/d/d3/2017_Honda_Civic_Type_R_FK8_in_Championship_White%2C_front_right%2C_08-04-2024.jpg';

const CBR150R_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/b/b7/2021_Honda_CBR150R_ABS.jpg';
// User-supplied photos for the 2019 entry specifically.
const CBR150R_2019_BASE_IMAGE = '/vehicles/cbr150r-2019-base.jpg';
const CBR150R_2019_RIM_BLACK_WHITE_IMAGE = '/vehicles/cbr150r-2019-rim-black-white.jpg';
const CBR150R_2019_DECAL_RACING_STRIPES_IMAGE = '/vehicles/cbr150r-2019-decal-racing-stripes.webp';
// User-supplied photos for the 2022 entry specifically.
const CBR150R_2022_PAINT_BLACK_IMAGE = '/vehicles/cbr150r-2022-paint-black.jpg';
const CBR150R_2022_PAINT_ORANGE_IMAGE = '/vehicles/cbr150r-2022-paint-orange.jpg';
const CBR150R_2022_RIM_BLACK_IMAGE = '/vehicles/cbr150r-2022-rim-black.jpg';
const CBR150R_2022_RIM_BLUE_IMAGE = '/vehicles/cbr150r-2022-rim-blue.jpg';
const CBR150R_2022_DECAL_FLAME_IMAGE = '/vehicles/cbr150r-2022-decal-flame.jpg';
const CBR150R_2022_DECAL_YELLOW_IMAGE = '/vehicles/cbr150r-2022-decal-yellow.jpg';

const R15_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Yamaha_R15_V3.0.jpg';
const R15_V3_BLUE_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/R15_bike_race.jpg';

const COROLLA_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/61/Toyota_Corolla_2.0_XEi_2022.jpg';
const COROLLA_WHITE_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/b/b3/2022_Toyota_Corolla_2.0_XLI_CVT_%28Brazil%29.jpg';
const COROLLA_RED_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/5/50/2021_Toyota_Corolla_Altis_1.8_red_front_view_in_Brunei.jpg';
const COROLLA_GRAY_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/6/6e/Toyota_Corolla_Altis_ZRE211_1.6_V_Celestite_Gray_Metallic_01.jpg';
// User-supplied photos.
const COROLLA_RIM_GOLD_IMAGE = '/vehicles/corolla-rim-gold.jpg';
const COROLLA_RIM_WHITE_IMAGE = '/vehicles/corolla-rim-white.jpg';
const COROLLA_SPOILER_LIP_IMAGE = '/vehicles/corolla-spoiler-lip.jpg';
const COROLLA_SPOILER_WING_IMAGE = '/vehicles/corolla-spoiler-wing.jpg';
const COROLLA_DECAL_CHECKERED_STRIPES_IMAGE = '/vehicles/corolla-decal-checkered-stripes.jpg';

const CB_HORNET_160R_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/2/20/2017_Honda_CB_Hornet_160R_-_Howrah_20170610103542.jpg';
// User-supplied photos (Wikimedia has no other photos of this bike) — served
// straight out of client/public/vehicles/.
const CB_HORNET_160R_RED_IMAGE = '/vehicles/cb-hornet-160r-red.png';
const CB_HORNET_160R_BLACK_IMAGE = '/vehicles/cb-hornet-160r-black.jpg';
const CB_HORNET_160R_TRIBAL_IMAGE = '/vehicles/cb-hornet-160r-tribal.jpg';
const CB_HORNET_160R_RACING_STRIPES_IMAGE = '/vehicles/cb-hornet-160r-racing-stripes.jpg';

// Standard-trim SF250 in a plain factory color — the previous base photo was
// the "100th Anniversary MotoGP Edition" racing livery, which isn't a normal
// paint option, so it's kept below only as a clearly-labeled alternate.
const GIXXER_SF250_BLUE_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/d/db/Suzuki_Gixxer_Sf250_%E3%83%88%E3%83%AA%E3%83%88%E3%83%B3%E3%83%96%E3%83%AB%E3%83%BC.jpg';
const GIXXER_SF250_MOTOGP_EDITION_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/7/78/2021_Suzuki_Gixxer_SF_250_100th_Anniversary_MotoGP_Edition_02.jpg';
// User-supplied photos.
const GIXXER_SF_GREY_IMAGE = '/vehicles/gixxer-sf-paint-grey.jpg';
const GIXXER_SF_DECAL_SPORTS_IMAGE = '/vehicles/gixxer-sf-decal-sports.jpg';
const GIXXER_SF_DECAL_BLUE_GRAPHICS_IMAGE = '/vehicles/gixxer-sf-decal-blue-graphics.jpg';

// Honda City and Mitsubishi Lancer already exist as Vehicle documents from
// the Parts Search feature (Hafizur) — matched here by the exact
// make/model spelling he used, so these entries add customization support
// to the SAME documents instead of creating duplicates.
const HONDA_CITY_2022_IMAGE = '/vehicles/honda-city-2022-base.jpg';
const HONDA_CITY_2020_IMAGE = '/vehicles/honda-city-2020-base.jpg';
const MITSUBISHI_LANCER_2017_IMAGE = '/vehicles/mitsubishi-lancer-2017-base.jpg';

// The previous base photo (YAMAHA_FZ-S.jpg) was the 2008-2013 FZ16-based V1,
// a full generation older than the 2019+ FZS-FI V3 this entry represents —
// same class of mismatch as the Civic Type R FK8/FL5 bug, now fixed.
const FZS_V3_GREY_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/7/79/Fzsb6v3.jpg';
const FZS_V3_BLACK_MAROON_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Yamaha_FZS.jpg';

const VEHICLES = [
  {
    make: 'Honda',
    model: 'Civic Type R',
    year: 2023,
    bodyType: 'Hatchback',
    baseImageUrl: CIVIC_TYPE_R_FL5_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'spoiler', 'body_kit', 'brake_caliper', 'decals'],
    photoOptions: {
      paint_color: [
        { key: 'racing_blue', label: 'Racing Blue', imageUrl: CIVIC_TYPE_R_FL5_BLUE_IMAGE },
        { key: 'championship_white', label: 'Championship White', imageUrl: CIVIC_TYPE_R_FL5_WHITE_IMAGE },
      ],
    },
  },
  {
    make: 'Honda',
    model: 'Civic Type R',
    year: 2020,
    bodyType: 'Hatchback',
    // FK8 generation — visually distinct from the FL5 above, so it gets its
    // own accurate photo rather than reusing the 2023 car's image.
    baseImageUrl: CIVIC_TYPE_R_FK8_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'decals'],
    photoOptions: {
      paint_color: [
        { key: 'rallye_red', label: 'Rallye Red', imageUrl: CIVIC_TYPE_R_FK8_RED_IMAGE },
        { key: 'championship_white', label: 'Championship White', imageUrl: CIVIC_TYPE_R_FK8_WHITE_IMAGE },
      ],
    },
  },
  {
    make: 'Honda',
    model: 'CBR150R',
    year: 2019,
    bodyType: 'Motorbike',
    baseImageUrl: CBR150R_2019_BASE_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'decals'],
    optionOverrides: {
      rims: [
        { key: 'black_and_white', label: 'Black and White', imageUrl: CBR150R_2019_RIM_BLACK_WHITE_IMAGE },
      ],
      decals: [
        { key: 'racing_stripes', label: 'Racing Stripes', imageUrl: CBR150R_2019_DECAL_RACING_STRIPES_IMAGE },
      ],
    },
  },
  {
    make: 'Yamaha',
    model: 'R15',
    year: 2021,
    bodyType: 'Motorbike',
    baseImageUrl: R15_IMAGE,
    customizationCategories: ['paint_color', 'body_kit', 'decals'],
    photoOptions: {
      paint_color: [{ key: 'racing_blue', label: 'Racing Blue', imageUrl: R15_V3_BLUE_IMAGE }],
    },
  },
  {
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    bodyType: 'Sedan',
    baseImageUrl: COROLLA_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'spoiler', 'decals'],
    photoOptions: {
      paint_color: [
        { key: 'white', label: 'White', imageUrl: COROLLA_WHITE_IMAGE },
        { key: 'red', label: 'Red', imageUrl: COROLLA_RED_IMAGE },
        { key: 'gray', label: 'Gray', imageUrl: COROLLA_GRAY_IMAGE },
      ],
      // 'lip' and 'wing' are the existing generic spoiler keys — attaching
      // real photos to them rather than introducing new ones. 'stripes' is
      // the existing generic decal key ("Racing Stripes").
      spoiler: [
        { key: 'lip', imageUrl: COROLLA_SPOILER_LIP_IMAGE },
        { key: 'wing', imageUrl: COROLLA_SPOILER_WING_IMAGE },
      ],
      decals: [{ key: 'stripes', imageUrl: COROLLA_DECAL_CHECKERED_STRIPES_IMAGE }],
    },
    optionOverrides: {
      // Gold/White are paint finishes, not shapes, so they don't map onto
      // the generic stock/sport/alloy rim set — replaced outright instead.
      rims: [
        { key: 'gold', label: 'Gold', imageUrl: COROLLA_RIM_GOLD_IMAGE },
        { key: 'white', label: 'White', imageUrl: COROLLA_RIM_WHITE_IMAGE },
      ],
    },
  },
  {
    make: 'Honda',
    model: 'CB Hornet 160R',
    // Honda discontinued the CB Hornet 160R in Nov 2020 (replaced by the
    // visually distinct "Hornet 2.0"), so a 2021 model year doesn't
    // correspond to a real product. 2020 was its last sold year, same body
    // style as the reference photo.
    year: 2020,
    bodyType: 'Motorbike',
    baseImageUrl: CB_HORNET_160R_IMAGE,
    customizationCategories: ['paint_color', 'decals'],
    photoOptions: {
      paint_color: [
        { key: 'red', label: 'Red', imageUrl: CB_HORNET_160R_RED_IMAGE },
        // User-confirmed use despite this looking like a Hornet 2.0 (gold
        // USD forks, "2.0" badge) rather than the CB Hornet 160R.
        { key: 'black', label: 'Black', imageUrl: CB_HORNET_160R_BLACK_IMAGE },
      ],
      decals: [
        { key: 'tribal', label: 'Tribal Graphics', imageUrl: CB_HORNET_160R_TRIBAL_IMAGE },
        { key: 'stripes', label: 'Racing Stripes', imageUrl: CB_HORNET_160R_RACING_STRIPES_IMAGE },
      ],
    },
    // All paint_color and decals photos for this bike are user-supplied —
    // Wikimedia has no other photos of it to source from.
  },
  {
    make: 'Honda',
    model: 'CBR150R',
    year: 2022,
    bodyType: 'Motorbike',
    baseImageUrl: CBR150R_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'decals'],
    photoOptions: {
      paint_color: [
        { key: 'black', label: 'Black', imageUrl: CBR150R_2022_PAINT_BLACK_IMAGE },
        { key: 'orange', label: 'Orange', imageUrl: CBR150R_2022_PAINT_ORANGE_IMAGE },
      ],
    },
    optionOverrides: {
      rims: [
        { key: 'black', label: 'Black', imageUrl: CBR150R_2022_RIM_BLACK_IMAGE },
        { key: 'blue', label: 'Blue', imageUrl: CBR150R_2022_RIM_BLUE_IMAGE },
      ],
      decals: [
        { key: 'flame', label: 'Flame Graphics', imageUrl: CBR150R_2022_DECAL_FLAME_IMAGE },
        { key: 'yellow_racing', label: 'Yellow Racing', imageUrl: CBR150R_2022_DECAL_YELLOW_IMAGE },
      ],
    },
  },
  {
    make: 'Suzuki',
    model: 'Gixxer SF',
    year: 2021,
    bodyType: 'Motorbike',
    baseImageUrl: GIXXER_SF250_BLUE_IMAGE,
    customizationCategories: ['paint_color', 'decals'],
    photoOptions: {
      paint_color: [
        { key: 'motogp_edition', label: 'MotoGP Edition Livery', imageUrl: GIXXER_SF250_MOTOGP_EDITION_IMAGE },
        { key: 'grey', label: 'Grey', imageUrl: GIXXER_SF_GREY_IMAGE },
      ],
    },
    optionOverrides: {
      decals: [
        { key: 'sports', label: 'Sports', imageUrl: GIXXER_SF_DECAL_SPORTS_IMAGE },
        { key: 'blue_graphics', label: 'Blue Graphics', imageUrl: GIXXER_SF_DECAL_BLUE_GRAPHICS_IMAGE },
      ],
    },
  },
  {
    make: 'Honda',
    model: 'CITY',
    year: 2022,
    bodyType: 'Sedan',
    baseImageUrl: HONDA_CITY_2022_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'spoiler', 'decals'],
  },
  {
    make: 'Honda',
    model: 'CITY',
    year: 2020,
    bodyType: 'Sedan',
    baseImageUrl: HONDA_CITY_2020_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'spoiler', 'decals'],
  },
  {
    make: 'Mitsubisi',
    model: 'LANCHER',
    year: 2017,
    bodyType: 'Sedan',
    baseImageUrl: MITSUBISHI_LANCER_2017_IMAGE,
    customizationCategories: ['paint_color', 'rims', 'spoiler', 'decals'],
  },
  {
    make: 'Yamaha',
    model: 'FZS FI',
    year: 2021,
    bodyType: 'Motorbike',
    baseImageUrl: FZS_V3_GREY_IMAGE,
    customizationCategories: ['paint_color', 'decals'],
    photoOptions: {
      paint_color: [
        { key: 'black_maroon_gold', label: 'Black / Gold Wheels', imageUrl: FZS_V3_BLACK_MAROON_IMAGE },
      ],
    },
  },
  {
    make: 'Yamaha',
    model: 'R15 V3',
    year: 2020,
    bodyType: 'Motorbike',
    baseImageUrl: R15_IMAGE,
    customizationCategories: ['paint_color', 'body_kit', 'decals'],
    photoOptions: {
      paint_color: [{ key: 'racing_blue', label: 'Racing Blue', imageUrl: R15_V3_BLUE_IMAGE }],
    },
  },
  {
    make: 'Yamaha',
    model: 'R15 V3',
    year: 2022,
    bodyType: 'Motorbike',
    baseImageUrl: R15_IMAGE,
    customizationCategories: ['paint_color', 'body_kit', 'decals'],
    photoOptions: {
      paint_color: [{ key: 'racing_blue', label: 'Racing Blue', imageUrl: R15_V3_BLUE_IMAGE }],
    },
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // The CB Hornet 160R used to be seeded under year 2021, which we've since
  // corrected to 2020 (see comment above) — remove the old, wrong entry so
  // it doesn't linger as a duplicate.
  await Vehicle.deleteOne({ make: 'Honda', model: 'CB Hornet 160R', year: 2021 });

  // CBR150R 2020 removed — only 2019 and 2022 are kept for this project.
  await Vehicle.deleteOne({ make: 'Honda', model: 'CBR150R', year: 2020 });

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
