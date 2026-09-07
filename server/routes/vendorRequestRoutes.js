const express = require('express');
const router = express.Router();
const { protect, requireRole, requireServiceCategory } = require('../middleware/authMiddleware');
const {
<<<<<<< HEAD
  getIncomingRequests, respondToRequest, advanceRequest, getRequestRoute,
=======
  getIncomingRequests, respondToRequest, advanceRequest,
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
} = require('../controllers/vendorRequestController');

router.use(protect, requireRole('vendor'), requireServiceCategory('mechanic_center'));
router.get('/', getIncomingRequests);
router.patch('/:id/respond', respondToRequest);
router.patch('/:id/advance', advanceRequest);
<<<<<<< HEAD
router.get('/:id/route', getRequestRoute);
=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f

module.exports = router;