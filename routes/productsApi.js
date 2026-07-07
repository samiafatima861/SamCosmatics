const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productsController');

// List products (supports ?limit & ?offset)
router.get('/', ctrl.getAllProducts);

// Get single product
router.get('/:id', ctrl.getProduct);

// Create new product
router.post('/', ctrl.createNewProduct);

// Update product (partial/full)
router.put('/:id', ctrl.updateProduct);

// Delete product
router.delete('/:id', ctrl.deleteProduct);

module.exports = router;