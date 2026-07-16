const Review = require('../models/review');

exports.list = async (req, res) => {
  const status = req.query.status || null;
  const reviews = await Review.getAll(status);
  res.render('admin/reviews', { title: 'Reviews', reviews, currentFilter: status });
};

exports.approve = async (req, res) => {
  await Review.updateStatus(req.params.id, 'approved');
  res.redirect('/admin/reviews');
};

exports.reject = async (req, res) => {
  await Review.updateStatus(req.params.id, 'rejected');
  res.redirect('/admin/reviews');
};

exports.delete = async (req, res) => {
  await Review.remove(req.params.id);
  res.redirect('/admin/reviews');
};