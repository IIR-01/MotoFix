const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { getPendingVendors, approveVendor, rejectVendor } = require('../controllers/adminController');

router.use(protect, requireRole('admin'));
router.get('/vendors/pending', getPendingVendors);
router.patch('/vendors/:id/approve', approveVendor);
router.patch('/vendors/:id/reject', rejectVendor);

module.exports = router;
