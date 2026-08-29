const Vehicle = require('../models/Vehicle');
const CustomizationOption = require('../models/CustomizationOption');

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

// GET /api/customization/options?bodyType=
// The set of selectable options (paint colors, rim styles, etc.) for a body
// type, used to drive the Visual Customizer preview.
exports.getCustomizationOptions = async (req, res) => {
  const { bodyType } = req.query;
  if (!bodyType) return res.status(400).json({ message: 'bodyType is required' });
  const options = await CustomizationOption.find({ bodyType }).sort({ category: 1, order: 1 });
  res.json(options);
};
