const db = require('../config/db');

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

module.exports = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async getBySlug(slug) {
    const [rows] = await db.query('SELECT * FROM categories WHERE slug = ? LIMIT 1', [slug]);
    return rows[0] || null;
  },

  async create({ name, image_url }) {
    const slug = slugify(name);
    const [result] = await db.query(
      'INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)',
      [name, slug, image_url || null]
    );
    return result.insertId;
  },

  async update(id, { name, image_url }) {
    const slug = slugify(name);
    const [result] = await db.query(
      'UPDATE categories SET name = ?, slug = ?, image_url = ? WHERE id = ?',
      [name, slug, image_url || null, id]
    );
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async count() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM categories');
    return rows[0].total;
  },

  async getWithProductCount() {
    const sql = `
      SELECT c.id, c.name, c.slug, c.image_url, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id, c.name, c.slug, c.image_url
      ORDER BY c.name ASC`;
    const [rows] = await db.query(sql);
    return rows;
  }
};