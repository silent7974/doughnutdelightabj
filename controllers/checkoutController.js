const mongoose = require("mongoose");
const Cart = require("../models/cart");
const User = require('../models/user');
const axios = require("axios");

const checkout_index = async (req, res) => {
    try {
        const userId = req.user.id;
        const userCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate("items.productId");

        let cartItems = [];
        let totalPrice = 0;

        if (userCart && userCart.items.length > 0) {
            cartItems = userCart.items.map(item => {
                totalPrice += item.quantity * item.productId.price;
                return {
                    name: item.productId.name,
                    price: item.productId.price,
                    quantity: item.quantity
                };
            });
        }

        res.render("checkout", { 
            title: "Checkout", 
            cartItems, 
            totalPrice,
            user: {
                fullName: req.user.name,
                email: req.user.email,
                phone: req.user.phoneNumber || "No phone number provided"
            }
        });

    } catch (error) {
        console.error("Checkout Controller Error:", error);
        res.status(500).render("500", { title: "Server Error" });
    }
};

const paymentSuccess = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const address = user.address || "No address provided";

        const reference = req.query.reference; // Get transaction reference from URL
        if (!reference) {
            return res.redirect("/"); // Redirect if no reference is provided
        }
        
        // Verify transaction with Paystack
        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${paystackSecretKey}` },
        });

        const transaction = response.data;
        if (transaction.status !== true || transaction.data.status !== "success") {
            return res.redirect("/"); // Redirect if payment is not successful
        }

        res.render("payment-success", { title: "Payment Successful", reference, address });
    } catch (error) {
        console.error("Error loading payment success page:", error);
        res.redirect("/"); // Redirect on error
    }
};

const storeLocation = { lat: 9.085121, lon: 7.419830 }; // Doughnut Delight location in Abuja

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

const getDeliveryCost = async (req, res) => {
    const { lat, lon, address } = req.body; // User’s selected location
    const userId = req.user._id;

    if (!lat || !lon) {
        return res.status(400).json({ error: "Invalid location data" });
    }

    const distance = calculateDistance(storeLocation.lat, storeLocation.lon, lat, lon);
    const pricePerKm = 500; // ₦500 per km (adjustable)
    const deliveryCost = Math.round(distance * pricePerKm);

    // Update user address in the database
    await User.findByIdAndUpdate(userId, { address });

    res.json({ distance: distance.toFixed(2), deliveryCost });
};

const updateUserLocation = async (req, res) => {
    const { lat, lon, address } = req.body;
    const userId = req.user._id;

    if (!lat || !lon || !address) {
        return res.status(400).json({ error: "Invalid location data" });
    }

    try {
        await User.findByIdAndUpdate(userId, { address });
        res.json({ success: true, message: "Location updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update location" });
    }
};

module.exports = { 
    checkout_index,
    paymentSuccess,
    getDeliveryCost,
    updateUserLocation
 };