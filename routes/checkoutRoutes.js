const express = require('express');
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated
const router = express.Router();

router.get('/checkout', authMiddleware, checkoutController.checkout_index);

router.get('/payment-success', authMiddleware, checkoutController.paymentSuccess);

router.post('/get-delivery-cost', authMiddleware, checkoutController.getDeliveryCost);

router.post('/update-user-location', authMiddleware, checkoutController.updateUserLocation);

module.exports = router;