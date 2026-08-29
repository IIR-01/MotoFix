const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
// role = 'customer' or 'vendor' — ONLY. Admin accounts are never created from
// user input (see seedAdmin.js); anything else supplied for role is ignored
// and silently treated as 'customer', so a crafted request can't self-grant
// admin or any other privilege.
exports.register = async (req, res) => {
  try {
    const {
      name, email, phone, password, role,
      businessName, address, serviceCategory, tradeLicense, location,
    } = req.body;

    const ALLOWED_ROLES = ['customer', 'vendor'];
    const safeRole = ALLOWED_ROLES.includes(role) ? role : 'customer';

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (
      safeRole === 'vendor' && serviceCategory === 'mechanic_center' &&
      (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number')
    ) {
      return res.status(400).json({ message: 'Shop location is required for mechanic centers' });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { name, email, phone, password: hashedPassword, role: safeRole };

    if (safeRole === 'vendor') {
      Object.assign(userData, { businessName, address, serviceCategory, tradeLicense });
      // verificationStatus defaults to 'pending' from the schema
      if (serviceCategory === 'mechanic_center') {
        // GeoJSON requires [lng, lat] order — this is the one place that
        // conversion happens, so nothing downstream has to think about it.
        userData.location = { type: 'Point', coordinates: [location.lng, location.lat] };
      }
    }

    const user = await User.create(userData);

    res.status(201).json({
      message:
        safeRole === 'vendor'
          ? 'Registered. Your application is pending verification.'
          : 'Registered successfully.',
      token: generateToken(user),
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.role === 'vendor' && user.verificationStatus !== 'approved') {
      return res.status(403).json({ message: `Your vendor account is ${user.verificationStatus}` });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        availabilityStatus: user.availabilityStatus,
        serviceCategory: user.serviceCategory,
        businessName: user.businessName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};