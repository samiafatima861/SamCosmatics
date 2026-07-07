// routes/adminRoutes.js
// console.log('auth:', typeof auth, 'ctrl:', typeof ctrl, 'requireAdmin:', typeof requireAdmin);

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/images/' });
const auth = require('../controllers/adminAuthController');
const ctrl = require('../controllers/adminController');
const requireAdmin = require('../middleware/requireAdmin');

// router.get('/admin/signup', auth.showSignup);
// router.post('/admin/signup', auth.signup);

const allowSignup = process.env.ALLOW_ADMIN_SIGNUP === 'true';

// Signup routes (enabled only when ALLOW_ADMIN_SIGNUP=true)
if (allowSignup) {
  router.get('/admin/signup', auth.showSignup);
  router.post('/admin/signup', auth.signup);
} else {
  router.get('/admin/signup', (req, res) => res.status(403).send('Signup disabled'));
  router.post('/admin/signup', (req, res) => res.status(403).send('Signup disabled'));
}

router.get('/admin/login', auth.showLogin);
router.post('/admin/login', auth.login);
router.post('/admin/logout', auth.logout);

// protected admin
router.get('/admin', requireAdmin, ctrl.dashboard);
router.get('/admin/profile', requireAdmin, ctrl.showProfile);
router.get('/admin/profile/edit', requireAdmin, ctrl.showEditProfile);
router.post('/admin/profile/edit', requireAdmin, upload.single('image'), ctrl.updateProfile);
router.post('/admin/profile/password', requireAdmin, ctrl.changePassword);

module.exports = router;
