const Request = require('../models/Request');
const User = require('../models/User');
const { getDistanceMatrix } = require('../services/orsClient');

const SEARCH_RADIUS_METERS = 15000; // 15km — wide enough to nearly always find someone in a city

// POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    const { issueCategory, location } = req.body;
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      return res.status(400).json({ message: 'A valid location (lat/lng) is required' });
    }
    const request = await Request.create({ customer: req.user.id, issueCategory, location });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/requests/mine
exports.getMyRequests = async (req, res) => {
  const requests = await Request.find({ customer: req.user.id })
    .populate('targetVendor', 'businessName phone')
    .sort('-createdAt');
  res.json(requests);
};

// DELETE /api/requests/:id — only while nothing has happened yet.
// Once a mechanic is engaged (Accepted/En Route), use cancel instead, which
// preserves the record rather than erasing it.
exports.deleteRequest = async (req, res) => {
  const request = await Request.findOne({ _id: req.params.id, customer: req.user.id });
  if (!request) return res.status(404).json({ message: 'Request not found' });
  if (request.status !== 'Pending') {
    return res.status(400).json({ message: 'Only a pending request can be deleted — use cancel for an active one' });
  }
  await request.deleteOne();
  res.json({ message: 'Request deleted' });
};

// PATCH /api/requests/:id/cancel — for a request already in progress.
exports.cancelRequest = async (req, res) => {
  const request = await Request.findOne({ _id: req.params.id, customer: req.user.id });
  if (!request) return res.status(404).json({ message: 'Request not found' });
  if (!['Accepted', 'En Route'].includes(request.status)) {
    return res.status(400).json({ message: 'Only an accepted, in-progress request can be cancelled' });
  }

  request.status = 'Cancelled';
  await request.save();

  // The mechanic working this shouldn't stay stuck marked Busy forever
  // just because the customer cancelled on their end.
  if (request.targetVendor) {
    await User.findByIdAndUpdate(request.targetVendor, { availabilityStatus: 'Available' });
  }

  res.json(request);
};

// GET /api/requests/:id/nearby-mechanics
// Two-stage search: MongoDB's geospatial index does the cheap "who's
// roughly nearby" filtering for free, then a single ORS Matrix call ranks
// that short list by real driving time — much better than calling a
// directions API once per candidate.
exports.findNearbyMechanics = async (req, res) => {
  try {
    const request = await Request.findOne({ _id: req.params.id, customer: req.user.id });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'Pending' || request.targetVendor) {
      return res.status(400).json({ message: 'This request has already been sent to a mechanic' });
    }

    const candidates = await User.find({
      role: 'vendor',
      serviceCategory: 'mechanic_center',
      verificationStatus: 'approved',
      availabilityStatus: 'Available',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [request.location.lng, request.location.lat] },
          $maxDistance: SEARCH_RADIUS_METERS,
        },
      },
    })
      .limit(10)
      .select('-password');

    if (candidates.length === 0) {
      return res.json({ candidates: [] });
    }

    const sourceCoord = [request.location.lng, request.location.lat];
    const destCoords = candidates.map((c) => c.location.coordinates);
    const matrix = await getDistanceMatrix(sourceCoord, destCoords);

    const ranked = candidates
      .map((mechanic, i) => ({
        id: mechanic._id,
        businessName: mechanic.businessName,
        address: mechanic.address,
        averageRating: mechanic.ratingCount > 0 ? mechanic.ratingSum / mechanic.ratingCount : null,
        ratingCount: mechanic.ratingCount,
        distanceMeters: matrix[i].distance,
        durationSeconds: matrix[i].duration,
        estimated: matrix[i].estimated,
        location: mechanic.location,
      }))
      .sort((a, b) => a.durationSeconds - b.durationSeconds);

    res.json({ candidates: ranked, requestLocation: request.location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/requests/:id/assign   body: { vendorId }
exports.assignMechanic = async (req, res) => {
  try {
    const { vendorId } = req.body;
    const request = await Request.findOne({ _id: req.params.id, customer: req.user.id });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'Pending' || request.targetVendor) {
      return res.status(400).json({ message: 'This request has already been sent to a mechanic' });
    }

    // Re-validate at assignment time, not just at search time — the
    // candidate list the customer is looking at could be a minute stale,
    // and the mechanic may have gone offline or been suspended since.
    const mechanic = await User.findOne({
      _id: vendorId,
      role: 'vendor',
      serviceCategory: 'mechanic_center',
      verificationStatus: 'approved',
      availabilityStatus: 'Available',
    });
    if (!mechanic) {
      return res.status(400).json({ message: 'That mechanic is no longer available — pick another' });
    }

    request.targetVendor = vendorId;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/requests/:id/rate   body: { rating, review }
exports.rateRequest = async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' });
    }

    const request = await Request.findOne({ _id: req.params.id, customer: req.user.id });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'Completed') {
      return res.status(400).json({ message: 'You can only rate a completed request' });
    }
    if (request.rating !== null) {
      return res.status(400).json({ message: 'This request has already been rated' });
    }

    request.rating = rating;
    request.review = review || '';
    await request.save();

    // $inc is atomic — safe even if two ratings landed at the same instant.
    await User.findByIdAndUpdate(request.targetVendor, {
      $inc: { ratingSum: rating, ratingCount: 1 },
    });

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};