const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');

router.get('/', protect, requireRole('customer'), getMyOrders);
router.get('/:id', protect, requireRole('customer'), getOrderById);
router.patch('/:id/status', protect, requireRole('vendor'), updateOrderStatus);

module.exports = router;
