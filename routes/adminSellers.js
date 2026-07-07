const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const ctrl = require('../controllers/adminSellerController');

router.get('/admin/sellers', requireAdmin, ctrl.list);
router.post('/admin/sellers/:id/approve', requireAdmin, ctrl.approve);
router.post('/admin/sellers/:id/reject', requireAdmin, ctrl.reject);

module.exports = router;