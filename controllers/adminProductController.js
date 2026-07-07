const path = require('path');
const Product = require('../models/product');
const ProductVariant = require('../models/productVariant');

exports.list = async (req,res) => {
  const products = await Product.getAll(500);
  res.render('admin/adminProducts', { title:'Manage Products', products });
};

exports.showCreate = (req,res) => res.render('admin/product-form', { product: {} });
// exports.create = async (req,res) => {
//   await Product.create(req.body); // validate/sanitize in real app
//   res.redirect('/admin/products');
// };

// exports.create = async (req, res, next) => {
//   try {
//      const body = req.body || {};
//     const { name, price, short_description, description, featured } = body;

//     const image_url = req.file
//       ? '/images/' + path.basename(req.file.path)
//       : (body.image_url || '/images/placeholder.png');

//     const payload = {
//       name,
//       price: Number(price || 0),
//       short_description: short_description || '',
//       description: description || '',
//       image_url,
//       featured: featured ? 1 : 0
//     };

//     await Product.create(payload);
//     res.redirect('/admin/adminProducts');
//   } catch (err) {
//     next(err);
//   }
// }
exports.create = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { name, price, short_description, description, featured, stock_quantity } = body;

    const image_url = req.file ? '/images/' + path.basename(req.file.path) : (body.image_url || '/images/placeholder.png');

    const payload = {
      name,
      price: Number(price || 0),
      cost_price: Number(cost_price || 0),
      short_description: short_description || '',
      description: description || '',
      image_url,
      featured: featured ? 1 : 0,
      stock_quantity: Number(stock_quantity || 0)
    };

    const result = await Product.create(payload);

    const variants = buildVariantsFromBody(body);
    if (variants.length) {
      await ProductVariant.replaceForProduct(result.insertId, variants);
    }

    res.redirect('/admin/adminProducts');
  } catch (err) {
    next(err);
  }
};

exports.showEdit = async (req, res) => {
  const product = await Product.getById(req.params.id);
  product.variants = await ProductVariant.getByProductId(req.params.id);
  res.render('admin/product-form', { product });
};

// exports.update = async (req,res) => {
//   await Product.update(req.params.id, req.body);
//   res.redirect('/admin/products');
// };

// exports.update = async (req, res, next) => {
//   try {
//     const body = req.body || {};
//     const { name, price, short_description, description, featured } = body;
//     let image_url = body.image_url; // hidden field fallback, if you add one
//     if (req.file) {
//       image_url = '/images/' + path.basename(req.file.path);
//     } else if (!image_url) {
//       const existing = await Product.getById(req.params.id);
//       image_url = existing ? existing.image_url : '/images/placeholder.png';
//     }

//     const payload = {
//       name,
//       price: Number(price || 0),
//       short_description: short_description || '',
//       description: description || '',
//       image_url,
//       featured: featured ? 1 : 0
//     };

//     await Product.update(req.params.id, payload);
//     res.redirect('/admin/adminProducts');
//   } catch (err) {
//     next(err);
//   }
// };

exports.update = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { name, price,cost_price, short_description, description, featured, stock_quantity } = body;

    let image_url = body.image_url;
    if (req.file) {
      image_url = '/images/' + path.basename(req.file.path);
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
      stock_quantity: Number(stock_quantity || 0)
    };

    await Product.update(req.params.id, payload);

    const variants = buildVariantsFromBody(body);
    await ProductVariant.replaceForProduct(req.params.id, variants);

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