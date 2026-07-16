const db = require('../config/db');

module.exports = {
  async get() {
    const [rows] = await db.query('SELECT * FROM site_settings WHERE id = 1 LIMIT 1');
    return rows[0] || null;
  },

  async update(fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return false;
    const set = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    const [result] = await db.query(`UPDATE site_settings SET ${set} WHERE id = 1`, values);
    return result.affectedRows > 0;
  }
};