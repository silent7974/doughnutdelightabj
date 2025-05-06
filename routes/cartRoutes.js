const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated
const router = express.Router();

router.post('/add', authMiddleware, cartController.addToCart);

router.get('/items', authMiddleware, cartController.getCartItem);

router.post('/remove', authMiddleware, cartController.removeFromCart);

router.get('/cart', authMiddleware, cartController.cart_index);

module.exports = router;