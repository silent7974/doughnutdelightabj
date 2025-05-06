const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// Define route
router.get('/menu', productController.product_index);

module.exports = router;