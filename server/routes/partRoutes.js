const express = require('express');
const router = express.Router();
const { searchParts } = require('../controllers/partController');

router.get('/search', searchParts);

module.exports = router;
