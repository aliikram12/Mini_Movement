const express = require('express');
const { createCheckoutSession, createPaymentIntent, webhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

module.exports = router;
