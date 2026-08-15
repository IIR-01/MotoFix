const User = require('../models/User');

// PATCH /api/vendor/availability
exports.updateAvailability = async (req, res) => {
  const { status } = req.body;
  if (!['Available', 'Busy', 'Offline'].includes(status)) {
    return res.status(400).json({ message: 'Status must be Available, Busy, or Offline' });
  }
  const vendor = await User.findByIdAndUpdate(
    req.user.id,
    { availabilityStatus: status },
    { returnDocument: 'after' }
  ).select('-password');
  res.json(vendor);
};
