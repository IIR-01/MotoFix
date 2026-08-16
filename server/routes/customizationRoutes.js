const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getVehicleOptions, getVehicleByConfig } = require('../controllers/customizationController');

router.use(protect);
router.get('/vehicles', getVehicleOptions);
router.get('/vehicles/lookup', getVehicleByConfig);

module.exports = router;
