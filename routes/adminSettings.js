const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'images') });
const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]);
const requireAdmin = require('../middleware/requireAdmin');
const ctrl = require('../controllers/adminSettingsController');

router.get('/admin/settings', requireAdmin, ctrl.show);
router.post('/admin/settings', requireAdmin, uploadFields, ctrl.update);

module.exports = router;