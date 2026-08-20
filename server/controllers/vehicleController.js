const Vehicle = require('../models/Vehicle');

// GET /api/vehicles/makes
exports.getMakes = async (req, res) => {
  const makes = await Vehicle.distinct('make');
  res.json(makes.sort());
};

// GET /api/vehicles/models?make=Honda
exports.getModels = async (req, res) => {
  const { make } = req.query;
  if (!make) return res.status(400).json({ message: 'make is required' });
  const models = await Vehicle.distinct('model', { make });
  res.json(models.sort());
};

// GET /api/vehicles/years?make=Honda&model=CBR150R
exports.getYears = async (req, res) => {
  const { make, model } = req.query;
  if (!make || !model) return res.status(400).json({ message: 'make and model are required' });
  const years = await Vehicle.distinct('year', { make, model });
  res.json(years.sort((a, b) => b - a));
};
