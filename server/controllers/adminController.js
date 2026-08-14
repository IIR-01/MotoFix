const User = require('../models/User');

// GET /api/admin/vendors/pending
exports.getPendingVendors = async (req, res) => {
  const vendors = await User.find({ role: 'vendor', verificationStatus: 'pending' }).select('-password');
  res.json(vendors);
};

// PATCH /api/admin/vendors/:id/approve
exports.approveVendor = async (req, res) => {
  const vendor = await User.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'approved' },
    { new: true }
  ).select('-password');
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  res.json(vendor);
};

// PATCH /api/admin/vendors/:id/reject
exports.rejectVendor = async (req, res) => {
  const vendor = await User.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'rejected' },
    { new: true }
  ).select('-password');
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  res.json(vendor);
};
