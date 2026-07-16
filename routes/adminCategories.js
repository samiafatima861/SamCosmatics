const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'images') });
const requireAdmin = require('../middleware/requireAdmin');
const ctrl = require('../controllers/adminCategoryController');

router.get('/admin/categories', requireAdmin, ctrl.list);
router.get('/admin/categories/new', requireAdmin, ctrl.showCreate);
router.post('/admin/categories/new', requireAdmin, upload.single('image'), ctrl.create);
router.get('/admin/categories/:id/edit', requireAdmin, ctrl.showEdit);
router.post('/admin/categories/:id/edit', requireAdmin, upload.single('image'), ctrl.update);
router.post('/admin/categories/:id/delete', requireAdmin, ctrl.delete);

module.exports = router;