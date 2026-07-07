const express = require('express');
const router = express.Router();
const auth = require('../controllers/customerAuthController');
const ctrl = require('../controllers/customerController');
const requireCustomer = require('../middleware/requireCustomer');

router.get('/signup', auth.showSignup);
router.post('/signup', auth.signup);
router.get('/login', auth.showLogin);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

router.get('/account', requireCustomer, ctrl.dashboard);
router.get('/account/edit', requireCustomer, ctrl.showEditProfile);
router.post('/account/edit', requireCustomer, ctrl.updateProfile);

module.exports = router;