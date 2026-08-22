const express = require('express');
const router = express.Router();
const { protect, requireRole, requireServiceCategory } = require('../middleware/authMiddleware');
const {
  createService, getMyServices, updateService, deleteService,
} = require('../controllers/serviceController');

router.use(protect, requireRole('vendor'), requireServiceCategory('mechanic_center'));
router.post('/', createService);
router.get('/mine', getMyServices);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
