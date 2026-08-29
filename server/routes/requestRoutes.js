const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  createRequest, getMyRequests, deleteRequest, cancelRequest,
  findNearbyMechanics, assignMechanic, rateRequest,
} = require('../controllers/requestController');

router.use(protect, requireRole('customer'));
router.post('/', createRequest);
router.get('/mine', getMyRequests);
router.delete('/:id', deleteRequest);
router.patch('/:id/cancel', cancelRequest);
router.get('/:id/nearby-mechanics', findNearbyMechanics);
router.patch('/:id/assign', assignMechanic);
router.patch('/:id/rate', rateRequest);

module.exports = router;