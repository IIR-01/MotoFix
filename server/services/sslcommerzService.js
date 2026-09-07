const crypto = require('crypto');

<<<<<<< HEAD
// Stand-in for the real SSLCommerz Session API until the team has store
// credentials (store_id / store_passwd) to integrate against. A real
// integration would POST to SSLCommerz's /gwprocess/v4/api.php here and get
// back a GatewayPageURL to redirect the customer to; this returns a URL to
// our own dummy gateway page instead, which mimics that hosted checkout
// step (see client/src/pages/PaymentGateway.jsx) and calls back into
// paymentController.completePayment the same way SSLCommerz's IPN/redirect
// would. Swapping in the real SDK later should only require changing this
// file — every caller only depends on the two functions below.
=======
// Real SSLCommerz integration (sandbox by default — set SSLCOMMERZ_IS_LIVE=true
// to switch to the live endpoints once the store goes live). Session API
// opens a hosted-checkout session and hands back a GatewayPageURL to send
// the customer's browser to; Validation API is called server-side once
// SSLCommerz redirects/POSTs back, since the redirect body can be spoofed
// and must never be trusted on its own (see paymentController's ssl/*
// handlers).
const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === 'true';
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;

const SESSION_API_URL = IS_LIVE
  ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
  : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
const VALIDATION_API_URL = IS_LIVE
  ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
  : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f

function generateTranId(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

<<<<<<< HEAD
function buildGatewayUrl(tranId) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return `${clientUrl}/payment/gateway/${tranId}`;
}

module.exports = { generateTranId, buildGatewayUrl };
=======
// Opens a Session API transaction and returns the GatewayPageURL to redirect
// the customer's browser to. Throws if SSLCommerz rejects the request (bad
// credentials, missing required field, etc) — callers should surface that as
// a 502 rather than silently falling back to a fake gateway.
async function initiateSession({ tranId, amount, productName, customer, successUrl, failUrl, cancelUrl, ipnUrl }) {
  if (!STORE_ID || !STORE_PASSWORD) {
    throw new Error('SSLCommerz is not configured (missing SSLCOMMERZ_STORE_ID/SSLCOMMERZ_STORE_PASSWORD)');
  }

  const body = new URLSearchParams({
    store_id: STORE_ID,
    store_passwd: STORE_PASSWORD,
    total_amount: String(amount),
    currency: 'BDT',
    tran_id: tranId,
    success_url: successUrl,
    fail_url: failUrl,
    cancel_url: cancelUrl,
    ipn_url: ipnUrl,
    shipping_method: 'NO',
    product_name: productName,
    product_category: 'General',
    product_profile: 'general',
    num_of_item: '1',
    cus_name: customer.name,
    cus_email: customer.email,
    cus_add1: customer.address || 'N/A',
    cus_city: customer.city || 'Dhaka',
    cus_postcode: customer.postcode || '1000',
    cus_country: 'Bangladesh',
    cus_phone: customer.phone || 'N/A',
    ship_name: customer.name,
    ship_add1: customer.address || 'N/A',
    ship_city: customer.city || 'Dhaka',
    ship_postcode: customer.postcode || '1000',
    ship_country: 'Bangladesh',
  });

  const response = await fetch(SESSION_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await response.json();

  if (data.status !== 'SUCCESS' || !data.GatewayPageURL) {
    throw new Error(data.failedreason || 'SSLCommerz rejected the payment session');
  }
  return data.GatewayPageURL;
}

// Confirms a completed transaction with SSLCommerz directly (server-to-
// server), rather than trusting the tran_id/amount/status fields SSLCommerz
// posts back to success_url/ipn_url — those arrive via the customer's
// browser (or an unauthenticated webhook) and could be forged.
async function validateTransaction(valId) {
  const params = new URLSearchParams({
    val_id: valId,
    store_id: STORE_ID,
    store_passwd: STORE_PASSWORD,
    format: 'json',
  });
  const response = await fetch(`${VALIDATION_API_URL}?${params.toString()}`);
  return response.json();
}

module.exports = { generateTranId, initiateSession, validateTransaction };
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
