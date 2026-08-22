const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { createRequest, getMyRequests } = require('../controllers/requestController');

router.use(protect, requireRole('customer'));
router.post('/', createRequest);
router.get('/mine', getMyRequests);

module.exports = router;