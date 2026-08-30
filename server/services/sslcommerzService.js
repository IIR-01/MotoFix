const crypto = require('crypto');

// Stand-in for the real SSLCommerz Session API until the team has store
// credentials (store_id / store_passwd) to integrate against. A real
// integration would POST to SSLCommerz's /gwprocess/v4/api.php here and get
// back a GatewayPageURL to redirect the customer to; this returns a URL to
// our own dummy gateway page instead, which mimics that hosted checkout
// step (see client/src/pages/PaymentGateway.jsx) and calls back into
// paymentController.completePayment the same way SSLCommerz's IPN/redirect
// would. Swapping in the real SDK later should only require changing this
// file — every caller only depends on the two functions below.

function generateTranId(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

function buildGatewayUrl(tranId) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return `${clientUrl}/payment/gateway/${tranId}`;
}

module.exports = { generateTranId, buildGatewayUrl };
