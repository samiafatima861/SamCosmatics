const db = require('../config/db');
module.exports = {
  
async getAll(limit = 100) {
    const sql = `
      SELECT p.id, p.name, p.price, p.cost_price, p.short_description, p.image_url, p.stock_quantity, p.seller_id, p.category_id, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC LIMIT ?`;
    const [rows] = await db.query(sql, [Number(limit)]);
    return rows;
  },

  async getById(id) {
    const sql = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  },

  async getByCategory(categoryId, limit = 100) {
  const sql = `SELECT id, name, price, short_description, image_url FROM products WHERE category_id = ? ORDER BY id DESC LIMIT ?`;
  const [rows] = await db.query(sql, [categoryId, Number(limit)]);
  return rows;
  },


  async count() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM products');
    return rows[0].total;
  },

  async create(data = {}) {
    const {
      name = '', price = 0.0, cost_price = 0.0, short_description = '', description = '', image_url = '', featured = 0, stock_quantity = 0, category_id = null, seller_id = null
    } = data;
    if (!name) throw new Error('Product name required');
    const sql = `INSERT INTO products (name, price, cost_price, short_description, description, image_url, featured, stock_quantity, category_id, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [name, Number(price), Number(cost_price), short_description, description, image_url, Number(featured), Number(stock_quantity), category_id || null, seller_id]);
    return { insertId: result.insertId };
  },

  async update(id, fields = {}) {
    const keys = Object.keys(fields);
    if (!keys.length) return false;
    const set = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(id);
    const sql = `UPDATE products SET ${set} WHERE id = ?`;
    const [result] = await db.query(sql, values);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const sql = `DELETE FROM products WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  },

  async search(q, limit = 50) {
    const like = `%${q}%`;
    const sql = `SELECT id, name, price, short_description, image_url, stock_quantity FROM products WHERE name LIKE ? OR short_description LIKE ? LIMIT ?`;
    const [rows] = await db.query(sql, [like, like, Number(limit)]);
    return rows;
  },

  async getLowStock(threshold = 5, limit = 20) {
    const sql = `SELECT id, name, image_url, stock_quantity FROM products WHERE stock_quantity <= ? ORDER BY stock_quantity ASC LIMIT ?`;
    const [rows] = await db.query(sql, [Number(threshold), Number(limit)]);
    return rows;
  },

  async decrementStock(id, qty, conn = db) {
    const sql = `UPDATE products SET stock_quantity = GREATEST(stock_quantity - ?, 0) WHERE id = ?`;
    const [result] = await conn.query(sql, [Number(qty), id]);
    return result.affectedRows > 0;
  },

  async getAllBySeller(sellerId) {
  const sql = `SELECT id, name, price, short_description, image_url, stock_quantity FROM products WHERE seller_id = ? ORDER BY id DESC`;
  const [rows] = await db.query(sql, [sellerId]);
  return rows;
},

async countBySeller(sellerId) {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM products WHERE seller_id = ?', [sellerId]);
  return rows[0].total;
},
};