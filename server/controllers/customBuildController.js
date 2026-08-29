const CustomBuild = require('../models/CustomBuild');

// POST /api/builds
exports.createBuild = async (req, res) => {
  const { name, vehicle, selection, previewImageUrl } = req.body;
  if (!name || !vehicle?.make || !vehicle?.model || !vehicle?.year) {
    return res.status(400).json({ message: 'name and vehicle (make, model, year) are required' });
  }
  const build = await CustomBuild.create({
    user: req.user.id,
    name,
    vehicle,
    selection: selection || [],
    previewImageUrl,
  });
  res.status(201).json(build);
};

// GET /api/builds/mine
exports.getMyBuilds = async (req, res) => {
  const builds = await CustomBuild.find({ user: req.user.id }).sort('-updatedAt');
  res.json(builds);
};

// GET /api/builds/:id
exports.getBuildById = async (req, res) => {
  const build = await CustomBuild.findOne({ _id: req.params.id, user: req.user.id });
  if (!build) return res.status(404).json({ message: 'Build not found' });
  res.json(build);
};

// PUT /api/builds/:id
exports.updateBuild = async (req, res) => {
  const { name, selection, previewImageUrl } = req.body;
  const build = await CustomBuild.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    {
      ...(name && { name }),
      ...(selection && { selection }),
      ...(previewImageUrl && { previewImageUrl }),
    },
    { new: true }
  );
  if (!build) return res.status(404).json({ message: 'Build not found' });
  res.json(build);
};

// DELETE /api/builds/:id
exports.deleteBuild = async (req, res) => {
  const build = await CustomBuild.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!build) return res.status(404).json({ message: 'Build not found' });
  res.json({ message: 'Build deleted' });
};

// GET /api/builds/shared/:token
// Public — no auth. Lets anyone with the link view (not edit) a build.
exports.getSharedBuild = async (req, res) => {
  const build = await CustomBuild.findOne({ shareToken: req.params.token }).select('-user');
  if (!build) return res.status(404).json({ message: 'Shared build not found' });
  res.json(build);
};
