const db = require('../config/db');

module.exports = {
  async create({ question, customer_id, customer_name, customer_email }) {
    const sql = `INSERT INTO faq_submissions (question, customer_id, customer_name, customer_email) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [question, customer_id || null, customer_name || null, customer_email || null]);
    return { insertId: result.insertId };
  },

  async getAll(status = null) {
    let sql = `SELECT * FROM faq_submissions`;
    const params = [];
    if (status) {
      sql += ` WHERE status = ?`;
      params.push(status);
    }
    sql += ` ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, params);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM faq_submissions WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async updateStatus(id, status) {
    const [result] = await db.query('UPDATE faq_submissions SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await db.query('DELETE FROM faq_submissions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};