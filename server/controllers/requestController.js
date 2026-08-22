const Request = require('../models/Request');

// POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    const { issueCategory, location } = req.body;

    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      return res.status(400).json({ message: 'A valid location (lat/lng) is required' });
    }

    const request = await Request.create({
      customer: req.user.id,
      issueCategory,
      location,
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/requests/mine
exports.getMyRequests = async (req, res) => {
  const requests = await Request.find({ customer: req.user.id }).sort('-createdAt');
  res.json(requests);
};