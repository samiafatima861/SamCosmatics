// controllers/checkoutController.js
const db = require('../config/db');
const Product = require('../models/product');
const Notification = require('../models/notification');

function computeCartItems(cart) {
  const items = [];
  let total = 0;
  for (const id of Object.keys(cart || {})) {
    const qty = Number(cart[id] || 0);
    if (qty <= 0) continue;
    items.push({ id, qty });
  }
  return { items, total };
}

exports.viewCheckoutPage = async (req, res, next) => {
  try {
    const cart = req.session.cart || {};
    const products = [];
    let total = 0;
    for (const id of Object.keys(cart)) {
      const p = await Product.getById(id);
      if (!p) continue;
      p.qty = Number(cart[id]);
      p.subtotal = p.qty * Number(p.price);
      total += p.subtotal;
      products.push(p);
    }
    if (!products.length) return res.redirect('/cart');
    res.render('checkout', { title: 'Checkout', products, total, customer: req.session.customer || null });
  } catch (err) {
    next(err);
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { fullName, email, phone, shippingAddress, billingAddress } = req.body;
    if (!fullName || !email || !shippingAddress) {
      // Re-render checking with error
      return res.status(400).render('checkout', { title: 'Checkout', error: 'Please fill required fields.', products: [], total: 0 });
    }

    const cart = req.session.cart || {};
    const items = [];
    let total = 0;
    for (const id of Object.keys(cart)) {
      const p = await Product.getById(id);
      if (!p) continue;
      const qty = Number(cart[id]);
      if (qty <= 0) continue;
      items.push({ product_id: p.id, qty, price: Number(p.price) });
      total += qty * Number(p.price);
    }
    if (!items.length) return res.status(400).render('checkout', { title: 'Checkout', error: 'Cart is empty.' });

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

        for (const it of items) {
    const [stockRows] = await conn.query('SELECT stock_quantity FROM products WHERE id = ? FOR UPDATE', [it.product_id]);
    const available = stockRows[0] ? stockRows[0].stock_quantity : 0;
    if (available < it.qty) {
      await conn.rollback();
      conn.release();
      return res.status(400).render('checkout', {
        title: 'Checkout',
        error: `Not enough stock for one of the items. Please update your cart.`,
        products: [],
        total: 0
      });
    }
  }
      

      const [orderRes] = await conn.query(
        `INSERT INTO orders
         (user_id, status, payment_method, payment_status, total, shipping_address, billing_address, customer_name, customer_email, customer_phone, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [req.session.customer?.id || null, 'pending', 'COD', 'pending', total, shippingAddress, billingAddress || shippingAddress, fullName, email, phone || null]
      );
      const orderId = orderRes.insertId;

      const rows = items.map(it => [orderId, it.product_id, it.qty, it.price]);
      if (rows.length) {
        await conn.query('INSERT INTO order_items (order_id, product_id, qty, price) VALUES ?', [rows]);
      }

      await conn.commit();

      Notification.create('order', `New order #${orderId} placed by ${fullName} — $${total.toFixed(2)}`, `/admin/orders/${orderId}`).catch(console.error)

      // clear cart and store last order id in session
      req.session.cart = {};
      req.session.lastOrder = { id: orderId };

      return res.render('order-confirm', { title: 'Order Confirmed', orderId });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('placeOrder error', err);
    return res.status(500).render('checkout', { title: 'Checkout', error: 'Server error, please try again.' });
  }
};
