const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  initOrderPayment,
  initVendorListingFeePayment,
  getPayment,
  completePayment,
} = require('../controllers/paymentController');

router.post('/order/init', protect, requireRole('customer'), initOrderPayment);
// Public: this runs before the vendor has an account, let alone a token.
router.post('/vendor-listing-fee/init', initVendorListingFeePayment);
// Public: stands in for SSLCommerz's own hosted checkout + callback, which
// obviously wouldn't carry a MotoFix auth token either.
router.get('/:tranId', getPayment);
router.post('/:tranId/complete', completePayment);

module.exports = router;
