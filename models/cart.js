// models/cart.js
const db = require('../config/db');

// Save a new order (simple example)
exports.createOrder = async (userId = null, items = {}) => {
  // items: { productId: qty, ... }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [orderRes] = await conn.query(
      'INSERT INTO orders (user_id, created_at) VALUES (?, NOW())',
      [userId]
    );
    const orderId = orderRes.insertId;
    const rows = [];
    for (const [productId, qty] of Object.entries(items)) {
      rows.push([orderId, productId, qty]);
    }
    if (rows.length) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, qty) VALUES ?',
        [rows]
      );
    }
    await conn.commit();
    return { orderId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
