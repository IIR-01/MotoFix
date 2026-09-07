const express = require('express');
const router = express.Router();
const { reverseGeocode } = require('../services/geocode');

// No auth on purpose: Register.jsx needs this before a vendor account
// (and therefore a token) exists.
router.get('/reverse', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ message: 'lat and lng query params are required' });
  }
  const result = await reverseGeocode(lat, lng);
  res.json(result);
});

module.exports = router;