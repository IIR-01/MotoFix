const express = require('express');
const router = express.Router();
const { protect, requireRole, requireServiceCategory } = require('../middleware/authMiddleware');
const {
  getIncomingRequests, respondToRequest, advanceRequest, getRequestRoute,
} = require('../controllers/vendorRequestController');

router.use(protect, requireRole('vendor'), requireServiceCategory('mechanic_center'));
router.get('/', getIncomingRequests);
router.patch('/:id/respond', respondToRequest);
router.patch('/:id/advance', advanceRequest);
router.get('/:id/route', getRequestRoute);

module.exports = router;