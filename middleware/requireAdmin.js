// middleware/requireAdmin.js
module.exports = (req, res, next) => {
  if (req.session && req.session.admin && req.session.admin.id) return next();
  // if JSON/API request
  if (req.xhr || req.path.startsWith('/api/')) return res.status(401).json({ success:false, message:'Unauthorized' });
  return res.redirect('/admin/login');
};
