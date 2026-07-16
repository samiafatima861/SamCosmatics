const Customer = require('../models/customer');

exports.list = async (req, res) => {
  const customers = await Customer.getAll();
  res.render('admin/customers', { title: 'Customers', customers, summary: { total: customers.length } });
};