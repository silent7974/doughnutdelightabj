const CustomOrder = require("../models/custom");

// Create a custom order
const createCustomOrder = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: Please log in to submit your order.' });
    }
    
    try {
        const userId = req.user._id; // Assuming `req.user` contains authenticated user's details
        const customOrder = new CustomOrder({
            ...req.body,
            user: userId // Associate the order with the logged-in user
        });

        await customOrder.save();

        // Redirect with the new custom order's ID in the query string
        res.redirect(`/customCheckout?orderId=${customOrder._id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all custom orders for a user
const getUserCustomOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you're using `req.user` for the logged-in user
        const orderId = req.query.orderId;

        let customOrder;

        if (orderId) {
            // Fetch only the specific order
            customOrder = await CustomOrder.findOne({ _id: orderId, user: userId });
        }

         // If no orderId in query or no matching order, render a message
         if (!customOrder) {
            return res.status(404).send('Order not found or unauthorized access.');
        }

        res.render('customCheckout', { 
            customOrder, 
            title: 'Custom Checkout',
            user: {
                fullName: req.user.name,
                email: req.user.email,
                phone: req.user.phoneNumber || "No phone number provided"
            }
         });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createCustomOrder,
    getUserCustomOrders
};