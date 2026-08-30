const nodemailer = require('nodemailer');

// Sends real receipt emails through the project owner's own Gmail account
// (App Password auth) — the spec calls for real receipt emails and this
// project has no dedicated transactional-email provider set up.
//
// Requires EMAIL_USER (the Gmail address) and EMAIL_APP_PASSWORD (a Google
// Account App Password, not the regular login password — generate one at
// myaccount.google.com/apppasswords with 2-Step Verification turned on) in
// server/.env. Until both are set, this logs instead of sending, so nothing
// upstream breaks while that's still being configured.
let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

async function sendMail({ to, subject, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.log(`[MotoFix] Email not configured (missing EMAIL_USER/EMAIL_APP_PASSWORD) — would have sent "${subject}" to ${to}`);
    return;
  }
  try {
    await getTransporter().sendMail({
      from: `MotoFix <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    // A failed email should never fail the payment/order flow that
    // triggered it — log and move on.
    console.error(`[MotoFix] Failed to send email "${subject}" to ${to}:`, err.message);
  }
}

module.exports = { sendMail };
