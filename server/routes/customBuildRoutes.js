const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBuild,
  getMyBuilds,
  getBuildById,
  updateBuild,
  deleteBuild,
  getSharedBuild,
} = require('../controllers/customBuildController');

// Must be registered before the protect() gate below — viewing a shared
// build is the one action in this router that doesn't require login.
router.get('/shared/:token', getSharedBuild);

router.use(protect);
router.post('/', createBuild);
router.get('/mine', getMyBuilds);
router.get('/:id', getBuildById);
router.put('/:id', updateBuild);
router.delete('/:id', deleteBuild);

module.exports = router;
