const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const adminOrderCtrl = require('../controllers/adminOrderController');

router.get('/admin/orders', requireAdmin, adminOrderCtrl.list);
router.get('/admin/orders/:id', requireAdmin, adminOrderCtrl.view);
router.post('/admin/orders/:id/status', requireAdmin, adminOrderCtrl.updateStatus);

module.exports = router;