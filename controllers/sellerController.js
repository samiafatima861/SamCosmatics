const Product = require('../models/product');
const ProductVariant = require('../models/productVariant');
const path = require('path');

exports.dashboard = async (req, res) => {
  const products = await Product.getAllBySeller(req.session.seller.id);
  res.render('seller/dashboard', { title: 'Seller Dashboard', seller: req.session.seller, products });
};

exports.showCreate = (req, res) => {
  res.render('seller/product-form', { product: {}, seller: req.session.seller });
};

exports.create = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { name, price, short_description, description, stock_quantity } = body;
    const image_url = req.file ? '/images/' + path.basename(req.file.path) : '/images/placeholder.png';

    const payload = {
      name,
      price: Number(price || 0),
      short_description: short_description || '',
      description: description || '',
      image_url,
      featured: 0,
      stock_quantity: Number(stock_quantity || 0),
      seller_id: req.session.seller.id
    };

    await Product.create(payload);
    res.redirect('/seller/dashboard');
  } catch (err) {
    next(err);
  }
};

exports.showEdit = async (req, res) => {
  const product = await Product.getById(req.params.id);
  if (!product || product.seller_id !== req.session.seller.id) {
    return res.status(403).send('Not authorized to edit this product');
  }
  product.variants = await ProductVariant.getByProductId(req.params.id);
  res.render('seller/product-form', { product, seller: req.session.seller });
};

exports.update = async (req, res, next) => {
  try {
    const existing = await Product.getById(req.params.id);
    if (!existing || existing.seller_id !== req.session.seller.id) {
      return res.status(403).send('Not authorized to edit this product');
    }

    const body = req.body || {};
    const { name, price, short_description, description, stock_quantity } = body;
    let image_url = existing.image_url;
    if (req.file) image_url = '/images/' + path.basename(req.file.path);

    await Product.update(req.params.id, {
      name,
      price: Number(price || 0),
      short_description: short_description || '',
      description: description || '',
      image_url,
      stock_quantity: Number(stock_quantity || 0)
    });

    res.redirect('/seller/dashboard');
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const existing = await Product.getById(req.params.id);
    if (!existing || existing.seller_id !== req.session.seller.id) {
      return res.status(403).send('Not authorized to delete this product');
    }
    await Product.remove(req.params.id);
    res.redirect('/seller/dashboard');
  } catch (err) {
    next(err);
  }
};