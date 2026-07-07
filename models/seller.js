const db = require('../config/db');

module.exports = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM sellers WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, address, image_url, status FROM sellers WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, passwordHash, phone, address }) {
    const [result] = await db.query(
      'INSERT INTO sellers (name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, phone || null, address || null]
    );
    return result.insertId;
  },

  async count() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM sellers');
    return rows[0].total;
  },

  async getAll() {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, status, created_at FROM sellers ORDER BY created_at DESC'
    );
    return rows;
  },

  async updateStatus(id, status) {
    const [result] = await db.query('UPDATE sellers SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  async updateProfile(id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return false;
    const set = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(id);
    const [result] = await db.query(`UPDATE sellers SET ${set} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },
  
  async getReport() {
  const sql = `
    SELECT
      s.id, s.name, s.email, s.status,
      COUNT(DISTINCT p.id) AS product_count,
      COALESCE(SUM(oi.qty), 0) AS units_sold,
      COALESCE(SUM(oi.qty * oi.price), 0) AS revenue
    FROM sellers s
    LEFT JOIN products p ON p.seller_id = s.id
    LEFT JOIN order_items oi ON oi.product_id = p.id
    GROUP BY s.id, s.name, s.email, s.status
    ORDER BY revenue DESC`;
  const [rows] = await db.query(sql);
  return rows;
 }

};