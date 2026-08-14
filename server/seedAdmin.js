// Run once with: npm run seed:admin
// Creates a single admin account so you have someone who can approve
// vendor registrations while testing locally. Safe to run multiple times —
// it skips creating a duplicate if the admin already exists.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const ADMIN_EMAIL = 'admin@motofix.com';
const ADMIN_PASSWORD = 'admin1234';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log('Admin already exists:', ADMIN_EMAIL);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    name: 'Admin',
    email: ADMIN_EMAIL,
    phone: '0000000000',
    password: hashedPassword,
    role: 'admin',
  });

  console.log(`Admin created — email: ${ADMIN_EMAIL}  password: ${ADMIN_PASSWORD}`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
