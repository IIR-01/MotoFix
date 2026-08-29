const Request = require('../models/Request');
const User = require('../models/User');

// GET /api/vendor/requests — everything ever targeted at this mechanic
exports.getIncomingRequests = async (req, res) => {
  const requests = await Request.find({ targetVendor: req.user.id })
    .populate('customer', 'name phone')
    .sort('-createdAt');
  res.json(requests);
};

// PATCH /api/vendor/requests/:id/respond   body: { decision: 'accept' | 'reject' }
exports.respondToRequest = async (req, res) => {
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
};