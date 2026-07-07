const Customer = require('../models/customer');
const Order = require('../models/order');

exports.dashboard = async (req, res) => {
  const orders = await Order.getByCustomerId(req.session.customer.id);
  res.render('customer/account', { title: 'My Account', customer: req.session.customer, orders });
};

exports.showEditProfile = async (req, res) => {
  const customer = await Customer.findById(req.session.customer.id);
  res.render('customer/account-edit', { title: 'Edit Profile', customer });
};

exports.updateProfile = async (req, res) => {
  const id = req.session.customer.id;
  const fields = {};
  if (req.body.name) fields.name = req.body.name;
  if (req.body.phone) fields.phone = req.body.phone;
  if (req.body.address) fields.address = req.body.address;
  await Customer.updateProfile(id, fields);
  const updated = await Customer.findById(id);
  req.session.customer = { id: updated.id, name: updated.name, email: updated.email, image_url: updated.image_url };
  res.redirect('/account');
};