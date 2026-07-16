const db = require('../config/db');

function slugify(title) {
  return title.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

module.exports = {
  slugify,

  async getAllAdmin() {
    const [rows] = await db.query('SELECT * FROM blogs ORDER BY created_at DESC');
    return rows;
  },

  async getPublished(limit = 20) {
    const [rows] = await db.query(
      'SELECT * FROM blogs WHERE status = "published" ORDER BY created_at DESC LIMIT ?',
      [Number(limit)]
    );
    return rows;
  },

  async getBySlug(slug) {
    const [rows] = await db.query('SELECT * FROM blogs WHERE slug = ? LIMIT 1', [slug]);
    return rows[0] || null;
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create({ title, slug, excerpt, content, cover_image_url, status }) {
    const sql = `INSERT INTO blogs (title, slug, excerpt, content, cover_image_url, status) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [title, slug, excerpt || '', content, cover_image_url || null, status || 'draft']);
    return { insertId: result.insertId };
  },

  async update(id, { title, slug, excerpt, content, cover_image_url, status }) {
    const sql = `UPDATE blogs SET title=?, slug=?, excerpt=?, content=?, cover_image_url=?, status=? WHERE id=?`;
    const [result] = await db.query(sql, [title, slug, excerpt || '', content, cover_image_url || null, status || 'draft', id]);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await db.query('DELETE FROM blogs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};