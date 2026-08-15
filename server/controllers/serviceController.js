const Service = require('../models/Service');

// POST /api/services
exports.createService = async (req, res) => {
  try {
    const { serviceName, description, basePrice } = req.body;
    const service = await Service.create({
      vendor: req.user.id,
      serviceName,
      description,
      basePrice,
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/services/mine
exports.getMyServices = async (req, res) => {
  const services = await Service.find({ vendor: req.user.id }).sort('-createdAt');
  res.json(services);
};

// PUT /api/services/:id
exports.updateService = async (req, res) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, vendor: req.user.id }, // scoped to the logged-in vendor
    req.body,
    { returnDocument: 'after' }
  );
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json(service);
};

// DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  const service = await Service.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json({ message: 'Service deleted' });
};
