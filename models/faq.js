const db = require('../config/db');

module.exports = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM faqs ORDER BY sort_order ASC, id ASC');
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM faqs WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create({ question, answer, sort_order }) {
    const sql = `INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [question, answer, Number(sort_order) || 0]);
    return { insertId: result.insertId };
  },

  async update(id, { question, answer, sort_order }) {
    const sql = `UPDATE faqs SET question=?, answer=?, sort_order=? WHERE id=?`;
    const [result] = await db.query(sql, [question, answer, Number(sort_order) || 0, id]);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await db.query('DELETE FROM faqs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};