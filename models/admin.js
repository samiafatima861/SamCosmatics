// models/admin.js
const db = require('../config/db');

module.exports = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },
  async findById(id) {
    const [rows] = await db.query('SELECT id, name, email, phone, address, image_url FROM admins WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },
  async create({ name, email, passwordHash }) {
    const [res] = await db.query('INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)', [name, email, passwordHash]);
    return res.insertId;
  },
  async updateProfile(id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return false;
    const set = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(id);
    const [r] = await db.query(`UPDATE admins SET ${set} WHERE id = ?`, values);
    return r.affectedRows > 0;
  }
};
