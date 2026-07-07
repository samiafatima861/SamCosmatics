module.exports = (req, res, next) => {
  if (!req.session.seller) {
    return res.redirect('/seller/login');
  }
  if (req.session.seller.status !== 'approved') {
    return res.render('seller/pending', { title: 'Account Pending', seller: req.session.seller });
  }
  next();
};