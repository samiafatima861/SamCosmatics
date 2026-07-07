const db = require('../config/db');

module.exports = {
  async getByProductId(productId) {
    const [rows] = await db.query(
      'SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC',
      [productId]
    );
    return rows;
  },

  // wipes and re-inserts all variants for a product — simplest way to keep create/edit in sync
  async replaceForProduct(productId, variants = [], conn = db) {
    await conn.query('DELETE FROM product_variants WHERE product_id = ?', [productId]);
    const rows = variants
      .filter(v => v.name && v.name.trim())
      .map(v => [productId, v.name.trim(), Number(v.stock || 0), Number(v.threshold || 5)]);
    if (rows.length) {
      await conn.query(
        'INSERT INTO product_variants (product_id, variant_name, stock_quantity, low_stock_threshold) VALUES ?',
        [rows]
      );
    }
  },

  async getAllWithVariants() {
    const [products] = await db.query(
      'SELECT id, name, image_url, stock_quantity FROM products ORDER BY id DESC'
    );
    const [variants] = await db.query('SELECT * FROM product_variants ORDER BY product_id, id');

    const variantsByProduct = {};
    for (const v of variants) {
      if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
      variantsByProduct[v.product_id].push(v);
    }

    return products.map(p => ({
      ...p,
      variants: variantsByProduct[p.id] || []
    }));
  }
};