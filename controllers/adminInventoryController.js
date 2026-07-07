const ProductVariant = require('../models/productVariant');

exports.list = async (req, res, next) => {
  try {
    const products = await ProductVariant.getAllWithVariants();
    res.render('admin/inventory', { title: 'Stock Inventory', products });
  } catch (err) {
    next(err);
  }
};