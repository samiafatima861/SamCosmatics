const Order = require('../models/order');

exports.list = async (req, res, next) => {
  try {
    const orders = await Order.getAll(200);
    const pending = orders.filter(o => o.status === 'pending').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

    res.render('admin/orders', {
      title: 'Orders',
      orders,
      summary: { total: orders.length, pending, delivered, totalRevenue }
    });
  } catch (err) {
    next(err);
  }
};

exports.view = async (req, res, next) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) return res.status(404).send('Order not found');
    res.render('admin/order-detail', { title: 'Order #' + order.id, order });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    await Order.updateStatus(req.params.id, req.body.status);
    res.redirect('/admin/orders/' + req.params.id);
  } catch (err) {
    next(err);
  }
};