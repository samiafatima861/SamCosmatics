const db = require('../config/db');

module.exports = {
  async create({ product_id, customer_id, rating, comment }) {
    const sql = `INSERT INTO reviews (product_id, customer_id, rating, comment, status) VALUES (?, ?, ?, ?, 'pending')`;
    const [result] = await db.query(sql, [product_id, customer_id, rating, comment || '']);
    return { insertId: result.insertId };
  },

  async getApprovedByProduct(productId) {
    const sql = `
      SELECT r.*, c.name AS customer_name
      FROM reviews r
      JOIN customers c ON c.id = r.customer_id
      WHERE r.product_id = ? AND r.status = 'approved'
      ORDER BY r.created_at DESC`;
    const [rows] = await db.query(sql, [productId]);
    return rows;
  },

  async getSummaryByProduct(productId) {
    const sql = `
      SELECT COUNT(*) AS total, COALESCE(AVG(rating), 0) AS avg_rating
      FROM reviews WHERE product_id = ? AND status = 'approved'`;
    const [rows] = await db.query(sql, [productId]);
    return rows[0];
  },

  async hasCustomerReviewed(productId, customerId) {
    const sql = `SELECT id FROM reviews WHERE product_id = ? AND customer_id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [productId, customerId]);
    return !!rows[0];
  },

  async getAll(status = null) {
    let sql = `
      SELECT r.*, c.name AS customer_name, p.name AS product_name
      FROM reviews r
      JOIN customers c ON c.id = r.customer_id
      JOIN products p ON p.id = r.product_id`;
    const params = [];
    if (status) {
      sql += ` WHERE r.status = ?`;
      params.push(status);
    }
    sql += ` ORDER BY r.created_at DESC`;
    const [rows] = await db.query(sql, params);
    return rows;
  },

  async updateStatus(id, status) {
    const sql = `UPDATE reviews SET status = ? WHERE id = ?`;
    const [result] = await db.query(sql, [status, id]);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const sql = `DELETE FROM reviews WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }
};