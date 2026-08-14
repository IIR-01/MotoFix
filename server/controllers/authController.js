const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
// role = 'customer' or 'vendor'. Vendors additionally submit business details
// and start in verificationStatus: 'pending' until an Admin approves them.
exports.register = async (req, res) => {
  try {
    const {
      name, email, phone, password, role,
      businessName, address, serviceCategory, tradeLicense,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { name, email, phone, password: hashedPassword, role: role || 'customer' };

    if (role === 'vendor') {
      Object.assign(userData, { businessName, address, serviceCategory, tradeLicense });
      // verificationStatus defaults to 'pending' from the schema
    }

    const user = await User.create(userData);

    res.status(201).json({
      message:
        role === 'vendor'
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
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
