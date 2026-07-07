const Seller = require('../models/seller');

exports.list = async (req, res) => {
  const sellers = await Seller.getReport();
  res.render('admin/sellers', { title: 'Sellers', sellers });
};

exports.approve = async (req, res) => {
  await Seller.updateStatus(req.params.id, 'approved');
  res.redirect('/admin/sellers');
};

exports.reject = async (req, res) => {
  await Seller.updateStatus(req.params.id, 'rejected');
  res.redirect('/admin/sellers');
};