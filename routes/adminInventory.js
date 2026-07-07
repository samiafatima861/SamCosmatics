const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const ctrl = require('../controllers/adminInventoryController');

router.get('/admin/inventory', requireAdmin, ctrl.list);

module.exports = router;