const express = require('express');
const router = express.Router();
const { protect, requireRole, requireServiceCategory } = require('../middleware/authMiddleware');
const { updateAvailability } = require('../controllers/vendorController');

router.use(protect, requireRole('vendor'), requireServiceCategory('mechanic_center'));
router.patch('/availability', updateAvailability);

module.exports = router;
