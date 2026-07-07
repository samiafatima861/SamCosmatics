module.exports = (req, res, next) => {
  if (!req.session.customer) {
    return res.redirect('/login');
  }
  next();
};