const Request = require('../models/Request');
const User = require('../models/User');
<<<<<<< HEAD
const { getDistanceMatrix, getRoute } = require('../services/orsClient');

const ACTIVE_STATUSES = ['Pending', 'Accepted', 'En Route'];

// GET /api/vendor/requests
exports.getIncomingRequests = async (req, res) => {
  try {
    const mechanic = await User.findById(req.user.id).select('location');
    const requests = await Request.find({ targetVendor: req.user.id })
      .populate('customer', 'name phone')
      .sort('-createdAt');

    const activeRequests = requests.filter((r) => ACTIVE_STATUSES.includes(r.status));

    let matrix = [];
    if (mechanic?.location?.coordinates && activeRequests.length > 0) {
      const source = mechanic.location.coordinates;
      const destinations = activeRequests.map((r) => [r.location.lng, r.location.lat]);
      matrix = await getDistanceMatrix(source, destinations);
    }

    let i = 0;
    const withDistance = requests.map((r) => {
      const obj = r.toObject();
      if (ACTIVE_STATUSES.includes(r.status) && mechanic?.location?.coordinates) {
        obj.distanceFromMe = matrix[i];
        i += 1;
      }
      return obj;
    });

    res.json({ requests: withDistance, mechanicLocation: mechanic?.location || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
=======

// GET /api/vendor/requests — everything ever targeted at this mechanic
exports.getIncomingRequests = async (req, res) => {
  const requests = await Request.find({ targetVendor: req.user.id })
    .populate('customer', 'name phone')
    .sort('-createdAt');
  res.json(requests);
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
};

// PATCH /api/vendor/requests/:id/respond   body: { decision: 'accept' | 'reject' }
exports.respondToRequest = async (req, res) => {
<<<<<<< HEAD
  try {
    const { decision } = req.body;
    const request = await Request.findOne({ _id: req.params.id, targetVendor: req.user.id });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'This request is no longer pending' });
    }

    if (decision === 'accept') {
      request.status = 'Accepted';
      await request.save();
      await User.findByIdAndUpdate(req.user.id, { availabilityStatus: 'Busy' });
    } else {
      // Reject doesn't cancel the request — it hands it back to the
      // customer's pool so they can pick another mechanic.
      request.status = 'Pending';
      request.targetVendor = null;
      await request.save();
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/vendor/requests/:id/advance   body: { status: 'En Route' | 'Completed' }
exports.advanceRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const ALLOWED_TRANSITIONS = { Accepted: 'En Route', 'En Route': 'Completed' };
    const request = await Request.findOne({ _id: req.params.id, targetVendor: req.user.id });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (ALLOWED_TRANSITIONS[request.status] !== status) {
      return res.status(400).json({ message: `Cannot move a request from ${request.status} to ${status}` });
    }

    request.status = status;
    await request.save();

    if (status === 'Completed') {
      await User.findByIdAndUpdate(req.user.id, { availabilityStatus: 'Available' });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/vendor/requests/:id/route
exports.getRequestRoute = async (req, res) => {
  try {
    const mechanic = await User.findById(req.user.id).select('location');
    const request = await Request.findOne({ _id: req.params.id, targetVendor: req.user.id });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (!mechanic?.location?.coordinates) {
      return res.status(400).json({ message: 'Your shop location is not set' });
    }

    const source = mechanic.location.coordinates;
    const destination = [request.location.lng, request.location.lat];
    const route = await getRoute(source, destination);
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
=======
  const { decision } = req.body;
  if (!['accept', 'reject'].includes(decision)) {
    return res.status(400).json({ message: 'decision must be "accept" or "reject"' });
  }

  const request = await Request.findOne({ _id: req.params.id, targetVendor: req.user.id });
  if (!request) return res.status(404).json({ message: 'Request not found' });
  if (request.status !== 'Pending') {
    return res.status(400).json({ message: 'This request has already been responded to' });
  }

  if (decision === 'accept') {
    request.status = 'Accepted';
    await request.save();
    // A mechanic actively on a job shouldn't keep showing up as a
    // candidate for brand-new requests until this one is done.
    await User.findByIdAndUpdate(req.user.id, { availabilityStatus: 'Busy' });
  } else {
    // Rejecting frees the request back up — the customer isn't stuck just
    // because one mechanic said no, they can pick someone else.
    request.status = 'Pending';
    request.targetVendor = null;
    await request.save();
  }

  res.json(request);
};

// PATCH /api/vendor/requests/:id/advance   body: { status: 'En Route' | 'Completed' }
// A strict state machine — no skipping steps, no moving a request that
// isn't even Accepted yet, regardless of what a crafted request tries to send.
exports.advanceRequest = async (req, res) => {
  const { status } = req.body;
  const ALLOWED_TRANSITIONS = { Accepted: 'En Route', 'En Route': 'Completed' };

  const request = await Request.findOne({ _id: req.params.id, targetVendor: req.user.id });
  if (!request) return res.status(404).json({ message: 'Request not found' });

  if (ALLOWED_TRANSITIONS[request.status] !== status) {
    return res.status(400).json({ message: `Cannot move a request from ${request.status} to ${status}` });
  }

  request.status = status;
  await request.save();

  if (status === 'Completed') {
    // Job's done — back to Available so new requests can reach this mechanic.
    await User.findByIdAndUpdate(req.user.id, { availabilityStatus: 'Available' });
  }

  res.json(request);
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
};