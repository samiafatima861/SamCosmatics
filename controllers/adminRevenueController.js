const Order = require('../models/order');

exports.view = async (req, res) => {
  const [summary, byStatus, byPayment, dailySales, topSelling] = await Promise.all([
    Order.getRevenueSummary(),
    Order.getRevenueByStatus(),
    Order.getRevenueByPaymentMethod(),
    Order.getDailySales(30),
    Order.getTopSellingProducts(5)
  ]);

  res.render('admin/revenue', {
    title: 'Revenue',
    summary,
    byStatus,
    byPayment,
    dailySales,
    topSelling
  });
};