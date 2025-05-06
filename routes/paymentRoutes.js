const express = require("express");
const paymentController = require('../controllers/paymentController');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/pay", paymentController.initiatePayment);

router.post("/clear-cart", authMiddleware, paymentController.clearCart);

module.exports = router;