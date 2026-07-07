const Seller = require('../models/seller');
const bcrypt = require('bcrypt');
const Notification = require('../models/notification');

exports.showSignup = (req, res) => {
  res.render('seller/signup', { title: 'Seller Signup' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.render('seller/signup', { title: 'Seller Signup', error: 'Please fill all required fields.' });
    }
    const existing = await Seller.findByEmail(email);
    if (existing) {
      return res.render('seller/signup', { title: 'Seller Signup', error: 'An account with this email already exists.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await Seller.create({ name, email, passwordHash, phone, address });
     Notification.create('seller_signup', `New seller application: ${name}`, '/admin/sellers').catch(console.error);
    res.render('seller/signup-success', { title: 'Application Submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).render('seller/signup', { title: 'Seller Signup', error: 'Something went wrong. Try again.' });
  }
};

exports.showLogin = (req, res) => {
  res.render('seller/login', { title: 'Seller Login' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const seller = await Seller.findByEmail(email);
  if (!seller) return res.render('seller/login', { title: 'Seller Login', error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, seller.password_hash);
  if (!ok) return res.render('seller/login', { title: 'Seller Login', error: 'Invalid credentials' });

  req.session.seller = {
    id: seller.id,
    name: seller.name,
    email: seller.email,
    image_url: seller.image_url,
    status: seller.status
  };
  return res.redirect('/seller/dashboard');
};

exports.logout = (req, res) => {
  req.session.seller = null;
  res.redirect('/seller/login');
};