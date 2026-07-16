const ProductVariant = require('../models/productVariant');

exports.list = async (req, res, next) => {
  try {
    const products = await ProductVariant.getAllWithVariants();

    let totalProducts = products.length;
    let healthy = 0, low = 0, outOfStock = 0;

    products.forEach(p => {
      if (p.variants.length === 0) {
        // simple product, no variants
        if (p.stock_quantity <= 0) outOfStock++;
        else if (p.stock_quantity <= 5) low++;
        else healthy++;
      } else {
        // count each variant separately
        p.variants.forEach(v => {
          if (v.stock_quantity <= 0) outOfStock++;
          else if (v.stock_quantity <= v.low_stock_threshold) low++;
          else healthy++;
        });
      }
    });

    res.render('admin/inventory', {
      title: 'Stock Inventory',
      products,
      summary: { totalProducts, healthy, low, outOfStock }
    });
  } catch (err) {
    next(err);
  }
};