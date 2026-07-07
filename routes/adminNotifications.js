const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const ctrl = require('../controllers/adminNotificationController');

router.get('/admin/notifications', requireAdmin, ctrl.list);

module.exports = router;