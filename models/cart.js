const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user collection
        required: true,
    },

    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product', // Reference to the product collection
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;