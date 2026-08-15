const User = require('../models/User');

// GET /api/admin/vendors/pending
exports.getPendingVendors = async (req, res) => {
  const vendors = await User.find({ role: 'vendor', verificationStatus: 'pending' }).select('-password');
  res.json(vendors);
};

// GET /api/admin/vendors/approved
exports.getApprovedVendors = async (req, res) => {
  const vendors = await User.find({ role: 'vendor', verificationStatus: 'approved' }).select('-password');
  res.json(vendors);
};

// PATCH /api/admin/vendors/:id/approve
exports.approveVendor = async (req, res) => {
  const vendor = await User.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'approved' },
    { returnDocument: 'after' }
  ).select('-password');
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  res.json(vendor);
};

// PATCH /api/admin/vendors/:id/reject
exports.rejectVendor = async (req, res) => {
  const vendor = await User.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'rejected' },
    { returnDocument: 'after' }
  ).select('-password');
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  res.json(vendor);
};

// PATCH /api/admin/vendors/:id/suspend
// For vendors found in violation of platform policy, per Common Workflow SL2.
// A suspended vendor is blocked at login by the same check that blocks
// pending/rejected vendors — no changes needed in authController for this.
exports.suspendVendor = async (req, res) => {
  const vendor = await User.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'suspended' },
    { returnDocument: 'after' }
  ).select('-password');
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  res.json(vendor);
};
