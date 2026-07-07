const path = require('path');
const express = require('express');
const router = express.Router();

const multer = require ('multer');
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'images') }); 
const requireAdmin = require('../middleware/requireAdmin');
const adminProductCtrl = require('../controllers/adminProductController');

router.get('/admin/adminProducts', requireAdmin, adminProductCtrl.list);
router.get('/admin/adminProducts/new', requireAdmin, adminProductCtrl.showCreate);
// router.post('/admin/products/new', requireAdmin, adminProductCtrl.create);
router.post('/admin/adminProducts/new', requireAdmin, upload.single('image'), adminProductCtrl.create);
router.get('/admin/adminProducts/:id/edit', requireAdmin, adminProductCtrl.showEdit);
// router.post('/admin/products/:id/edit', requireAdmin, adminProductCtrl.update);
router.post('/admin/adminProducts/:id/edit', requireAdmin, upload.single('image'), adminProductCtrl.update);
router.post('/admin/adminProducts/:id/delete', requireAdmin, adminProductCtrl.delete);

module.exports = router;


// const path = require('path');
// const express = require('express');
// const router = express.Router();

// const multer = require('multer');
// const upload = multer({ dest: path.join(__dirname, '..', 'public', 'images') }); 
// const requireAdmin = require('../middleware/requireAdmin');
// const adminProductCtrl = require('../controllers/adminProductController');

// router.get('/admin/products', requireAdmin, adminProductCtrl.list);
// router.get('/admin/products/new', requireAdmin, adminProductCtrl.showCreate);
// router.post('/admin/products/new', requireAdmin, upload.single('image'), adminProductCtrl.create);
// router.get('/admin/products/:id/edit', requireAdmin, adminProductCtrl.showEdit);
// router.post('/admin/products/:id/edit', requireAdmin, upload.single('image'), adminProductCtrl.update);
// router.post('/admin/products/:id/delete', requireAdmin, adminProductCtrl.delete);

// module.exports = router;
