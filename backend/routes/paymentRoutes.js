const express = require('express');
const router = express.Router();
const { createCheckoutSession, confirmPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-session', protect, createCheckoutSession);
router.post('/confirm', protect, confirmPayment);

module.exports = router;
