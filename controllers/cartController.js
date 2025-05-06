const Cart = require('../models/cart');
const Product = require('../models/product');
const mongoose = require('mongoose');

//For the cart page
const cart_index = async (req, res) => {
    try {
        const userId = req.user.id;
        const userCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate("items.productId");

        let cartItems = [];
        let totalQuantity = 0;
        let totalPrice = 0;
        let subtotal = 0;

         if (userCart && userCart.items.length > 0) {
            cartItems = userCart.items.map(item => {
                totalQuantity += item.quantity;
                totalPrice += item.quantity * item.productId.price;
                subtotal = totalPrice;
                return {
                    _id: item.productId._id,
                    name: item.productId.name,
                    description: item.productId.description,
                    price: item.productId.price,
                    image: item.productId.image,
                    quantity: item.quantity
                };
            });
        }

        res.render('cart', { title: 'Your Cart', cartItems, totalQuantity, totalPrice, subtotal });
    } catch (error) {
        console.error(error);
        res.status(500).render('500', { title: 'Server Error' });
    }
};

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user is authenticated and available in req.user
        const { productId } = req.body;

        // Check if the product ID is provided
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1; // Update quantity
        } else {
            cart.items.push({ productId, quantity: 1 });
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart', updatedQuantity: cart.items.find(item => item.productId.toString() === productId)?.quantity || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error });
    }
};

//Remove from cart
const removeFromCart = async (req, res) => {
    try{
        const userId = req.user._id; // Assuming user is authenticated and available in req.user
        const { productId } = req.body;


        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

       // Find the item in the cart
       const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

       if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not in cart" });
       }

       // Decrease quantity or remove item
       if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
             cart.items.splice(itemIndex, 1);
        }
        
        await cart.save();
        res.status(200).json({ message:  "Item updated in cart", updatedQuantity: cart.items.find(item => item.productId.toString() === productId)?.quantity || 0  });
    } catch (error) {
        res.status(500).json({ message: 'Error removing product from cart', error });
    }
};

//Update counter value
const getCartItem = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated request

        // Find the user's cart and populate product details
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate("items.productId");

        if (!cart) {
            console.log("No cart found for this user.");
            return res.status(200).json({ items: [], totalQuantity: 0, totalPrice: 0, subtotal: 0 }); // Return empty array if no cart exists
        }

            // Calculate total quantity and total price
            let totalQuantity = 0;
            let totalPrice = 0;
 
            // Extract necessary details from cart
            const cartItems = cart.items.map((item) => {
                totalQuantity += item.quantity;
                totalPrice += item.quantity * item.productId.price; // Multiply quantity by price
    
                return {
                    productId: item.productId._id,
                    name: item.productId.name,
                    description: item.productId.description,
                    price: item.productId.price,
                    quantity: item.quantity,
                    imageUrl: item.productId.image
                };
            });

        const subtotal = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

        res.status(200).json({ items: cartItems, totalQuantity, totalPrice, subtotal });

    } catch (error) {
        console.error("Error getting cart items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    addToCart,
    getCartItem,
    removeFromCart,
    cart_index
}