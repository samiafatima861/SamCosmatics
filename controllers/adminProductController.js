const path = require('path');
const Product = require('../models/product');
const ProductVariant = require('../models/productVariant');
const Category = require('../models/category');
const ProductImage = require('../models/productImage');

exports.list = async (req,res) => {
  const products = await Product.getAll(500);
  res.render('admin/adminProducts', { title:'Manage Products', products });
};

// exports.showCreate = (req,res) => res.render('admin/product-form', { product: {} });

exports.showCreate = async (req, res) => {
  const categories = await Category.getAll();
  res.render('admin/product-form', { product: {}, categories });
};

exports.create = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { name, price, cost_price, short_description, description, featured, stock_quantity, category_id } = body;

    const mainFile = req.files?.image?.[0];
    const galleryFiles = req.files?.images || [];

    const image_url = mainFile ? '/images/' + path.basename(mainFile.path) : (body.image_url || '/images/placeholder.png');

    const payload = {
      name,
      price: Number(price || 0),
      cost_price: Number(cost_price || 0),
      short_description: short_description || '',
      description: description || '',
      image_url,
      featured: featured ? 1 : 0,
      stock_quantity: Number(stock_quantity || 0),
      category_id: category_id || null
    };

    const result = await Product.create(payload);

    const variants = buildVariantsFromBody(body);
    if (variants.length) {
      await ProductVariant.replaceForProduct(result.insertId, variants);
    }
    if (galleryFiles.length) {
      const urls = galleryFiles.map(f => '/images/' + path.basename(f.path));
      await ProductImage.addImages(result.insertId, urls);
    }

    res.redirect('/admin/adminProducts');
  } catch (err) {
    next(err);
  }
};

exports.showEdit = async (req, res) => {
  const product = await Product.getById(req.params.id);
  product.variants = await ProductVariant.getByProductId(req.params.id);
  product.gallery = await ProductImage.getByProductId(req.params.id);
  const categories = await Category.getAll();
  res.render('admin/product-form', { product, categories });
 };


 exports.update = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { name, price,cost_price, short_description, description, featured, stock_quantity, category_id} = body;

    const mainFile = req.files?.image?.[0];
    const galleryFiles = req.files?.images || [];

    let image_url = body.image_url;
    if (mainFile) {
      image_url = '/images/' + path.basename(mainFile.path);
    } else if (!image_url) {
      const existing = await Product.getById(req.params.id);
      image_url = existing ? existing.image_url : '/images/placeholder.png';
    }

    const payload = {
      name,
      price: Number(price || 0),
      cost_price: Number(cost_price || 0),
      short_description: short_description || '',
      description: description || '',
      image_url,
      featured: featured ? 1 : 0,
      stock_quantity: Number(stock_quantity || 0),
      category_id: category_id || null
    };

    await Product.update(req.params.id, payload);

    const variants = buildVariantsFromBody(body);
    await ProductVariant.replaceForProduct(req.params.id, variants);

    if (galleryFiles.length) {
      const urls = galleryFiles.map(f => '/images/' + path.basename(f.path));
      await ProductImage.addImages(req.params.id, urls);
    }

    res.redirect('/admin/adminProducts');
  } catch (err) {
    next(err);
  }
};


exports.delete = async (req,res) => {
  await Product.remove(req.params.id);
  res.redirect('/admin/adminProducts');
};
function buildVariantsFromBody(body) {
  const names = [].concat(body.variant_name || []);
  const stocks = [].concat(body.variant_stock || []);
  const thresholds = [].concat(body.variant_threshold || []);
  return names.map((name, i) => ({
    name,
    stock: stocks[i],
    threshold: thresholds[i]
  }));
}