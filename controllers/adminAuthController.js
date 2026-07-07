// controllers/adminAuthController.js
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');



exports.showSignup = (req, res) => {
  res.render('admin/signup', { title: 'Admin Signup' });
};

exports.showLogin = (req,res) => res.render('admin/login', { title:'Admin Login' });

exports.signup = [
  // validation middleware (optional)
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/signup', { error: errors.array()[0].msg, form: req.body });
    }
    try {
      const { name, email, password, phone, address } = req.body;
      const exists = await Admin.findByEmail(email);
      if (exists) return res.render('admin/signup', { error: 'Email already registered', form: req.body });

      const hash = await bcrypt.hash(password, 10);
      const id = await Admin.create({ name, email, passwordHash: hash, phone, address });
      // auto-login after signup (optional)
      req.session.admin = { id, name, email, image_url: null };
      return res.redirect('/admin');
    } catch (err) {
      console.error(err);
      return res.render('admin/signup', { error: 'Server error' });
    }
  }
];


exports.login = async (req,res) => {
  const { email, password } = req.body;
  const admin = await Admin.findByEmail(email);
  if (!admin) return res.render('admin/login', { error:'Invalid credentials' });
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return res.render('admin/login', { error:'Invalid credentials' });
  // store safe admin info in session
  req.session.admin = { id: admin.id, name: admin.name, email: admin.email, image_url: admin.image_url };
  return res.redirect('/admin'); // admin dashboard
};

exports.logout = (req,res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
};
