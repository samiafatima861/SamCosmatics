// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const checkoutCtrl = require('../controllers/checkoutController');

// Show checkout page (must be GET so user can view form)
router.get('/checkout', checkoutCtrl.viewCheckoutPage);

// Handle form POST to place order (COD)
router.post('/checkout', checkoutCtrl.placeOrder);

module.exports = router;
