const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  createRequest, getMyRequests, deleteRequest, cancelRequest,
<<<<<<< HEAD
  findNearbyMechanics, assignMechanic, rateRequest, getRequestRoute,
=======
  findNearbyMechanics, assignMechanic, rateRequest,
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
} = require('../controllers/requestController');

router.use(protect, requireRole('customer'));
router.post('/', createRequest);
router.get('/mine', getMyRequests);
router.delete('/:id', deleteRequest);
router.patch('/:id/cancel', cancelRequest);
router.get('/:id/nearby-mechanics', findNearbyMechanics);
router.patch('/:id/assign', assignMechanic);
router.patch('/:id/rate', rateRequest);
<<<<<<< HEAD
router.get('/:id/route', getRequestRoute);
=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f

module.exports = router;