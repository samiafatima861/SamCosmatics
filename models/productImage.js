const db = require('../config/db');

module.exports = {
  async getByProductId(productId) {
    const [rows] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
      [productId]
    );
    return rows;
  },

  async addImages(productId, imageUrls = []) {
    if (!imageUrls.length) return;
    const rows = imageUrls.map((url, i) => [productId, url, i]);
    await db.query(
      'INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?',
      [rows]
    );
  },

  async removeImage(imageId) {
    await db.query('DELETE FROM product_images WHERE id = ?', [imageId]);
  }
};