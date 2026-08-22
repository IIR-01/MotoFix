const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the JWT sent in the Authorization header, then re-checks the
// user's CURRENT status in the database before letting the request through.
// This matters specifically for suspension: without this DB check, a vendor
// suspended by an admin could keep using their existing token normally for
// up to 7 days (until it naturally expires), since a JWT's claims are fixed
// at sign time and don't reflect anything that happens afterward.
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Account no longer exists' });
    }
    if (user.role === 'vendor' && user.verificationStatus !== 'approved') {
      return res.status(403).json({ message: `Your vendor account is ${user.verificationStatus}` });
    }

    req.user = { id: user._id.toString(), role: user.role, serviceCategory: user.serviceCategory };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Usage: router.use(protect, requireRole('vendor'))
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have access to this resource' });
  }
  next();
};

// Usage: router.use(protect, requireRole('vendor'), requireServiceCategory('mechanic_center'))
// Closes a real gap: the frontend already routes parts-store vendors away
// from mechanic-only pages, but without this, a parts-store vendor's valid
// token could still call these endpoints directly (Postman/curl), bypassing
// the UI entirely. This enforces the same boundary server-side.
const requireServiceCategory = (...categories) => (req, res, next) => {
  if (!categories.includes(req.user.serviceCategory)) {
    return res.status(403).json({ message: 'This action is not available for your vendor type' });
  }
  next();
};

module.exports = { protect, requireRole, requireServiceCategory };