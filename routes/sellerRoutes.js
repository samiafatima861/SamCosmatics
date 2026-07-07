const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'images') });

const auth = require('../controllers/sellerAuthController');
const ctrl = require('../controllers/sellerController');
const requireSeller = require('../middleware/requireSeller');

router.get('/seller/signup', auth.showSignup);
router.post('/seller/signup', auth.signup);
router.get('/seller/login', auth.showLogin);
router.post('/seller/login', auth.login);
router.post('/seller/logout', auth.logout);

router.get('/seller/dashboard', requireSeller, ctrl.dashboard);
router.get('/seller/products/new', requireSeller, ctrl.showCreate);
router.post('/seller/products/new', requireSeller, upload.single('image'), ctrl.create);
router.get('/seller/products/:id/edit', requireSeller, ctrl.showEdit);
router.post('/seller/products/:id/edit', requireSeller, upload.single('image'), ctrl.update);
router.post('/seller/products/:id/delete', requireSeller, ctrl.delete);

module.exports = router;