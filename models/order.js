const db = require('../config/db');

module.exports = {
  async count() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM orders');
    return rows[0].total;
  },

  async totalRevenue() {
    const [rows] = await db.query(
      `SELECT COALESCE(SUM(total),0) AS revenue FROM orders WHERE status != 'cancelled'`
    );
    return Number(rows[0].revenue);
  },

  async getAll(limit = 100) {
    const sql = `
      SELECT id, customer_name, customer_email, total, status, payment_method, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT ?`;
    const [rows] = await db.query(sql, [Number(limit)]);
    return rows;
  },

  async getById(id) {
    const [orderRows] = await db.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [id]);
    const order = orderRows[0] || null;
    if (!order) return null;

    const [items] = await db.query(
      `SELECT oi.qty, oi.price, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [id]
    );
    order.items = items;
    return order;
  },

  async updateStatus(id, status) {
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },
  async getTopSellingProducts(limit = 5) {
  const sql = `
    SELECT
      p.id,
      p.name,
      p.image_url,
      SUM(oi.qty) AS units_sold,
      SUM(oi.qty * oi.price) AS revenue
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    GROUP BY p.id, p.name, p.image_url
    ORDER BY units_sold DESC
    LIMIT ?`;
  const [rows] = await db.query(sql, [Number(limit)]);
  return rows;
 },

   async getTopSellers(limit = 5) {
  const sql = `
    SELECT
      s.id,
      s.name,
      s.image_url,
      SUM(oi.qty) AS units_sold,
      SUM(oi.qty * oi.price) AS revenue
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    JOIN sellers s ON s.id = p.seller_id
    GROUP BY s.id, s.name, s.image_url
    ORDER BY revenue DESC
    LIMIT ?`;
  const [rows] = await db.query(sql, [Number(limit)]);
  return rows;
 },

 async getByCustomerId(customerId) {
  const sql = `
    SELECT id, total, status, payment_method, created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC`;
  const [rows] = await db.query(sql, [customerId]);
  return rows;
 },

 async getDailySales(days = 7) {
  const sql = `
    SELECT DATE(created_at) AS day, SUM(total) AS revenue, COUNT(*) AS orders_count
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(created_at)
    ORDER BY day ASC`;
  const [rows] = await db.query(sql, [days]);
  return rows;
 },
  async getRevenueSummary() {
  const sql = `
    SELECT
      COALESCE(SUM(oi.qty * oi.price), 0) AS total_sales,
      COALESCE(SUM(oi.qty * p.cost_price), 0) AS total_cost
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status != 'cancelled'`;
  const [rows] = await db.query(sql);
  const totalSales = Number(rows[0].total_sales);
  const totalCost = Number(rows[0].total_cost);
  const profit = totalSales - totalCost;
  const margin = totalSales > 0 ? (profit / totalSales * 100) : 0;
  return { totalSales, totalCost, profit, margin };
},

async getRevenueByStatus() {
  const sql = `
    SELECT status, COUNT(*) AS order_count, COALESCE(SUM(total), 0) AS revenue
    FROM orders
    GROUP BY status
    ORDER BY revenue DESC`;
  const [rows] = await db.query(sql);
  return rows;
},

async getRevenueByPaymentMethod() {
  const sql = `
    SELECT payment_method, COUNT(*) AS order_count, COALESCE(SUM(total), 0) AS revenue
    FROM orders
    GROUP BY payment_method
    ORDER BY revenue DESC`;
  const [rows] = await db.query(sql);
  return rows;
}

};