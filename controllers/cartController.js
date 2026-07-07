// controllers/cartController.js
const Product = require('../models/product');
const CartModel = require('../models/cart');

function cartCount(cart = {}) {
  return Object.values(cart).reduce((a,b) => a + Number(b || 0), 0);
}

exports.viewCartPage = async (req, res, next) => {
  try {
    const cart = req.session.cart || {};
    const ids = Object.keys(cart);
    const products = [];
    for (const id of ids) {
      const p = await Product.getById(id);
      if (p) { p.qty = cart[id]; products.push(p); }
    }
    res.render('cart', { title: 'Cart', products, cartCount: cartCount(cart) });
  } catch (err) { next(err); }
};

exports.addToCart = (req, res) => {
  try {
    const id = String(req.params.id);
    const qty = Math.max(1, Number(req.body.qty) || 1);
    if (!req.session.cart) req.session.cart = {};
    req.session.cart[id] = (req.session.cart[id] || 0) + qty;
    res.json({ success: true, cart: req.session.cart, cartCount: cartCount(req.session.cart) });
  } catch (err) { console.error(err); res.status(500).json({ success: false }); }
};

exports.updateCart = (req, res) => {
  try {
    const id = String(req.params.id);
    const qty = Math.max(0, Number(req.body.qty) || 0);
    if (!req.session.cart) req.session.cart = {};
    if (qty <= 0) delete req.session.cart[id];
    else req.session.cart[id] = qty;
    res.json({ success: true, cart: req.session.cart, cartCount: cartCount(req.session.cart) });
  } catch (err) { console.error(err); res.status(500).json({ success: false }); }
};

exports.removeFromCart = (req, res) => {
  try {
    const id = String(req.params.id);
    if (req.session.cart && req.session.cart[id]) delete req.session.cart[id];
    res.json({ success: true, cart: req.session.cart || {}, cartCount: cartCount(req.session.cart || {}) });
  } catch (err) { console.error(err); res.status(500).json({ success: false }); }
};

exports.viewWishlistPage = async (req, res, next) => {
  try {
    const wishlist = req.session.wishlist || {};
    const ids = Object.keys(wishlist);
    const products = [];
    for (const id of ids) {
      const p = await Product.getById(id);
      if (p) products.push(p);
    }
    res.render('wishlist', { title: 'Wishlist', products });
  } catch (err) { next(err); }
};

exports.toggleWishlist = (req, res) => {
  try {
    const id = String(req.params.id);
    if (!req.session.wishlist) req.session.wishlist = {};
    if (req.session.wishlist[id]) delete req.session.wishlist[id];
    else req.session.wishlist[id] = Date.now();
    res.json({ success: true, wishlist: Object.keys(req.session.wishlist || {}) });
  } catch (err) { console.error(err); res.status(500).json({ success: false }); }
};

exports.moveWishlistToCart = (req, res) => {
  try {
    const id = String(req.params.id);
    if (!req.session.wishlist) req.session.wishlist = {};
    if (!req.session.cart) req.session.cart = {};
    req.session.cart[id] = (req.session.cart[id] || 0) + 1;
    delete req.session.wishlist[id];
    res.json({ success: true, cart: req.session.cart, wishlist: req.session.wishlist });
  } catch (err) { console.error(err); res.status(500).json({ success: false }); }
};

exports.checkout = (req, res) => {
  try {
    const cart = req.session.cart || {};
    if (!Object.keys(cart).length) return res.status(400).json({ success: false, message: 'Cart empty' });
    // Stub: create order here (save to DB) — for now store in session
    req.session.lastOrder = { id: Date.now(), items: cart };
    req.session.cart = {};
    res.json({ success: true, orderId: req.session.lastOrder.id });
  } catch (err) { console.error(err); res.status(500).json({ success: false }); }
};
