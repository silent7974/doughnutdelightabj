const express = require('express');
const customController = require('../controllers/customController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Review routes
router.post('/customOrders', authMiddleware, customController.createCustomOrder);

router.get('/customCheckout', authMiddleware, customController.getUserCustomOrders);

module.exports = router;