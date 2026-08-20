const express = require('express');
const router = express.Router();
const { getMakes, getModels, getYears } = require('../controllers/vehicleController');

router.get('/makes', getMakes);
router.get('/models', getModels);
router.get('/years', getYears);

module.exports = router;
