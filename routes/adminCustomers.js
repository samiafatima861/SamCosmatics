const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const ctrl = require('../controllers/adminCustomerController');

router.get('/admin/customers', requireAdmin, ctrl.list);

module.exports = router;