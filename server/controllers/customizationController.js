const Vehicle = require('../models/Vehicle');

exports.getVehicleOptions = async (req, res) => {
  const vehicles = await Vehicle.find({}, 'make model year').sort({ make: 1, model: 1, year: 1 });
  res.json(vehicles);
};

exports.getVehicleByConfig = async (req, res) => {
  const { make, model, year } = req.query;
  if (!make || !model || !year) {
    return res.status(400).json({ message: 'make, model, and year are required' });
  }
  const vehicle = await Vehicle.findOne({ make, model, year: Number(year) });
  if (!vehicle) return res.status(404).json({ message: 'No matching vehicle found' });
  res.json(vehicle);
};
