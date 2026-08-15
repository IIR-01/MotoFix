const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  getPendingVendors, getApprovedVendors, approveVendor, rejectVendor, suspendVendor,
} = require('../controllers/adminController');

router.use(protect, requireRole('admin'));
router.get('/vendors/pending', getPendingVendors);
router.get('/vendors/approved', getApprovedVendors);
router.patch('/vendors/:id/approve', approveVendor);
router.patch('/vendors/:id/reject', rejectVendor);
router.patch('/vendors/:id/suspend', suspendVendor);

module.exports = router;
