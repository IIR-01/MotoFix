const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  initOrderPayment,
  initVendorListingFeePayment,
  getPayment,
<<<<<<< HEAD
  completePayment,
=======
  handleSslSuccess,
  handleSslFail,
  handleSslIpn,
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
} = require('../controllers/paymentController');

router.post('/order/init', protect, requireRole('customer'), initOrderPayment);
// Public: this runs before the vendor has an account, let alone a token.
router.post('/vendor-listing-fee/init', initVendorListingFeePayment);
<<<<<<< HEAD
// Public: stands in for SSLCommerz's own hosted checkout + callback, which
// obviously wouldn't carry a MotoFix auth token either.
router.get('/:tranId', getPayment);
router.post('/:tranId/complete', completePayment);
=======

// Public: SSLCommerz calls these directly — success/fail/cancel via the
// customer's browser, ipn as a separate server-to-server webhook. None of
// them carry (or could carry) a MotoFix auth token.
router.post('/ssl/success', handleSslSuccess);
router.post('/ssl/fail', handleSslFail);
router.post('/ssl/cancel', handleSslFail);
router.post('/ssl/ipn', handleSslIpn);

// Public: the payment-result page polls this before a customer necessarily
// has a token (vendor listing fee flow).
router.get('/:tranId', getPayment);
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f

module.exports = router;
