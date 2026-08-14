const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  createService, getMyServices, updateService, deleteService,
} = require('../controllers/serviceController');

router.use(protect, requireRole('vendor'));
router.post('/', createService);
router.get('/mine', getMyServices);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
