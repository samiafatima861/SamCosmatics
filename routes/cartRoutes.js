// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cartController');

// pages
router.get('/cart', cartCtrl.viewCartPage);
router.get('/wishlist', cartCtrl.viewWishlistPage);

// API actions
router.post('/api/products/:id/cart', cartCtrl.addToCart);
router.post('/api/products/:id/cart/update', cartCtrl.updateCart);
router.post('/api/products/:id/cart/remove', cartCtrl.removeFromCart);
router.post('/api/products/:id/wishlist', cartCtrl.toggleWishlist);
router.post('/api/wishlist/:id/move-to-cart', cartCtrl.moveWishlistToCart);

// Checkout
router.post('/api/checkout', cartCtrl.checkout);

module.exports = router;
