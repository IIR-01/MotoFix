const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { updateAvailability } = require('../controllers/vendorController');

router.use(protect, requireRole('vendor'));
router.patch('/availability', updateAvailability);

module.exports = router;
