const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const ctrl = require('../controllers/adminRevenueController');

router.get('/admin/revenue', requireAdmin, ctrl.view);

module.exports = router;