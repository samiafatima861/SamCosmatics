const db = require('../config/db');

module.exports = {
  async create(type, message, link = null) {
    await db.query(
      'INSERT INTO notifications (type, message, link) VALUES (?, ?, ?)',
      [type, message, link]
    );
  },

  async getRecent(limit = 10) {
    const [rows] = await db.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT ?',
      [Number(limit)]
    );
    return rows;
  },

  async getUnreadCount() {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS total FROM notifications WHERE is_read = 0'
    );
    return rows[0].total;
  },

  async markAllRead() {
    await db.query('UPDATE notifications SET is_read = 1 WHERE is_read = 0');
  },

  async getAll(limit = 100) {
    const [rows] = await db.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT ?',
      [Number(limit)]
    );
    return rows;
  }
};