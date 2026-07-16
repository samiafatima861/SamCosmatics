// controllers/productsController.js
const Product = require('../models/product');
const Category = require('../models/category');
const ProductImage = require('../models/productImage');
const ProductVariant = require('../models/productVariant');
const Review = require('../models/review');

/* Page render handlers */

exports.listProductsPage = async (req, res) => {
  const categories = await Category.getAll();
  const selectedCategory = req.query.category;

  let products;
  if (selectedCategory) {
    products = await Product.getByCategory(selectedCategory, 200);
  } else {
    products = await Product.getAll(200);
  }

  res.render('products', { title: 'Shop', products, categories, selectedCategory });
};


exports.viewProductPage = async (req, res, next) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).render('404', { title: 'Not Found' });

    const gallery = await ProductImage.getByProductId(product.id);
    const variants = await ProductVariant.getByProductId(product.id);

    // build full image list: main image first, then gallery
    const allImages = [product.image_url || '/images/placeholder.png', ...gallery.map(g => g.image_url)];

    const reviews = await Review.getApprovedByProduct(product.id);
    const reviewSummary = await Review.getSummaryByProduct(product.id);
    const alreadyReviewed = req.session.customer
      ? await Review.hasCustomerReviewed(product.id, req.session.customer.id)
      : false;

    res.render('product-detail', { title: product.name, product, allImages, variants, reviews, reviewSummary, alreadyReviewed, reviewSubmitted: req.query.reviewSubmitted, reviewError: req.query.reviewError });
  } catch (err) {
    next(err);
  }
};

/* API handlers (renamed as requested) */
exports.getAllProducts = async (req, res) => {
  try {
    if (req.query.q) {
      const results = await Product.search(req.query.q, req.query.limit || 100);
      return res.json({ success: true, products: results });
    }
    const limit = parseInt(req.query.limit, 10) || 100;
    const offset = parseInt(req.query.offset, 10) || 0;
    const products = await Product.getAll(limit, offset);
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createNewProduct = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });
    const result = await Product.create(req.body);
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const fields = req.body;
    if (!Object.keys(fields).length) return res.status(400).json({ success: false, message: 'No fields to update' });
    const ok = await Product.update(req.params.id, fields);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found or no change' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const ok = await Product.remove(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* Session-based helpers (cart & wishlist) */
function cartCount(cart = {}) {
  return Object.values(cart).reduce((a, b) => a + Number(b || 0), 0);
}

exports.addToCart = async (req, res) => {
  try {
    const id = String(req.params.id);
    const qty = Number(req.body.qty) || 1;
    if (!req.session.cart) req.session.cart = {};
    req.session.cart[id] = (req.session.cart[id] || 0) + qty;
    res.json({ success: true, cart: req.session.cart, cartCount: cartCount(req.session.cart) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const id = String(req.params.id);
    if (req.session.cart && req.session.cart[id]) {
      delete req.session.cart[id];
    }
    res.json({ success: true, cart: req.session.cart || {}, cartCount: cartCount(req.session.cart || {}) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const id = String(req.params.id);
    if (!req.session.wishlist) req.session.wishlist = {};
    if (req.session.wishlist[id]) {
      delete req.session.wishlist[id];
    } else {
      req.session.wishlist[id] = Date.now();
    }
    res.json({ success: true, wishlist: Object.keys(req.session.wishlist || {}) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
