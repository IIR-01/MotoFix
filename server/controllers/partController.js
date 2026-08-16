const Vehicle = require('../models/Vehicle');
const Part = require('../models/Part');

// GET /api/parts/search?make=Honda&model=CBR150R&year=2020
// Exact-match search: all three of make, model, and year must match a known
// Vehicle before we look up parts compatible with it.
exports.searchParts = async (req, res) => {
  const { make, model, year } = req.query;
  if (!make || !model || !year) {
    return res.status(400).json({ message: 'make, model, and year are required' });
  }

  const vehicle = await Vehicle.findOne({ make, model, year: Number(year) });
  if (!vehicle) return res.json([]);

  const parts = await Part.find({ compatibleVehicles: vehicle._id }).sort('category');
  res.json(parts);
};
