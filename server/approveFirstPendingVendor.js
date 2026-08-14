// One-off helper: logs in as admin and approves the first pending vendor found.
// Avoids shell-specific curl quoting issues entirely — just plain JS.
// Run with: npm run approve:vendor  (backend must already be running)
require('dotenv').config();

const BASE = `http://localhost:${process.env.PORT || 5000}/api`;

const run = async () => {
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@motofix.com', password: 'admin1234' }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error('Admin login failed:', loginData.message);
    console.error('Did you run "npm run seed:admin" first?');
    process.exit(1);
  }
  const token = loginData.token;

  const pendingRes = await fetch(`${BASE}/admin/vendors/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const pending = await pendingRes.json();

  if (!pending.length) {
    console.log('No pending vendors found. Register one through the app first, then rerun this.');
    process.exit(0);
  }

  const vendor = pending[0];
  const approveRes = await fetch(`${BASE}/admin/vendors/${vendor._id}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const approved = await approveRes.json();

  console.log(`Approved: ${approved.businessName} (${approved.email})`);
  console.log('You can now log in as this vendor in the app.');
};

run().catch((err) => {
  console.error('Something went wrong:', err.message);
  console.error('Is the backend running? (npm run dev in another terminal)');
  process.exit(1);
});
