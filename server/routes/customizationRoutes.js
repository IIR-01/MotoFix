const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getVehicleOptions, getVehicleByConfig, getCustomizationOptions } = require('../controllers/customizationController');
const { getAiRecommendations } = require('../controllers/aiAdvisorController');

router.use(protect);
router.get('/vehicles', getVehicleOptions);
router.get('/vehicles/lookup', getVehicleByConfig);
router.get('/options', getCustomizationOptions);
router.post('/ai-advisor', getAiRecommendations);

module.exports = router;
