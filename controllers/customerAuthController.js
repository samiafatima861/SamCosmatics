const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const Notification = require('../models/notification');

exports.showSignup = (req, res) => {
  res.render('customer/signup', { title: 'Create Account' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.render('customer/signup', { title: 'Create Account', error: 'Please fill all required fields.' });
    }
    const existing = await Customer.findByEmail(email);
    if (existing) {
      return res.render('customer/signup', { title: 'Create Account', error: 'An account with this email already exists.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const id = await Customer.create({ name, email, passwordHash, phone, address });
    Notification.create('customer_signup', `New customer registered: ${name}`, '/admin/customers').catch(console.error);

    req.session.customer = { id, name, email, image_url: null };
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.status(500).render('customer/signup', { title: 'Create Account', error: 'Something went wrong. Try again.' });
  }
};

exports.showLogin = (req, res) => {
  res.render('customer/login', { title: 'Login' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const customer = await Customer.findByEmail(email);
  if (!customer) return res.render('customer/login', { title: 'Login', error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, customer.password_hash);
  if (!ok) return res.render('customer/login', { title: 'Login', error: 'Invalid credentials' });

  req.session.customer = {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    image_url: customer.image_url
  };
  const redirectTo = req.session.returnTo || '/account';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};

exports.logout = (req, res) => {
  req.session.customer = null;
  res.redirect('/');
};