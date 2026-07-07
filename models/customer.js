const db = require('../config/db');

module.exports = {
  async getAll() {
  const [rows] = await db.query(
    'SELECT id, name, email, phone, created_at FROM customers ORDER BY created_at DESC'
  );
  return rows;
 },


  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM customers WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, address, image_url FROM customers WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, passwordHash, phone, address }) {
    const [result] = await db.query(
      'INSERT INTO customers (name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, phone || null, address || null]
    );
    return result.insertId;
  },

  async count() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM customers');
    return rows[0].total;
  },

  async updateProfile(id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return false;
    const set = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(id);
    const [result] = await db.query(`UPDATE customers SET ${set} WHERE id = ?`, values);
    return result.affectedRows > 0;
  }
};