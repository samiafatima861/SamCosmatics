const Seller = require('../models/seller');

// exports.list = async (req, res) => {
//   const sellers = await Seller.getReport();
//   res.render('admin/sellers', { title: 'Sellers', sellers });
// };



exports.list = async (req, res) => {
  const sellers = await Seller.getReport();
  const pending = sellers.filter(s => s.status === 'pending').length;
  const approved = sellers.filter(s => s.status === 'approved').length;
  res.render('admin/sellers', {
    title: 'Sellers',
    sellers,
    summary: { total: sellers.length, pending, approved }
  });
};

exports.approve = async (req, res) => {
  await Seller.updateStatus(req.params.id, 'approved');
  res.redirect('/admin/sellers');
};

exports.reject = async (req, res) => {
  await Seller.updateStatus(req.params.id, 'rejected');
  res.redirect('/admin/sellers');
};