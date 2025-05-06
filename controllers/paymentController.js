const axios = require("axios");
const Cart = require("../models/cart");

const initiatePayment = async (req, res) => {
    try {
        const { email, amount } = req.body; // Get email and amount from frontend

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amount * 100, // Paystack expects amount in kobo
                callback_url: "http://localhost:3000/payment-success", // Redirect here after payment
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({ status: "success", authorization_url: response.data.data.authorization_url });

    } catch (error) {
        console.error("Paystack Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Payment initialization failed" });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete the cart
        await Cart.findOneAndDelete({ userId: userId });

        // Send success response
        res.json({ success: true, message: "Cart cleared successfully" });
    } catch (err) {
        console.error("Error clearing cart:", err);
        res.status(500).json({ success: false, error: "Failed to clear cart" });
    }
};

module.exports = { 
    initiatePayment,
    clearCart
};