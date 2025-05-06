const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    occasion: {
        type: String,
        required: true,
        enum: ["birthday", "wedding", "anniversary", "graduation", "baby-shower", "custom"]
    },
    size: {
        type: String,
        required: true,
        enum: ["Small", "Medium", "Large"]
    },
    tiers: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    },
    shape: {
        type: String,
        required: true,
        enum: ["round", "square", "rectangle", "heart"]
    },
    flavor: {
        type: String,
        required: true,
        enum: ["vanilla", "chocolate", "velvet"]
    },
    fillings: {
        type: String,
        required: true,
        enum: ["none", "chocolate", "fruit", "cream-cheese", "ganache"]
    },
    icing: {
        type: String,
        required: true,
        enum: ["buttercream", "fondant", "whipped cream", "ganache"]
    },
    decorations: {
        type: String,
        required: true,
        enum: ["simple", "sprinkles", "flowers", "themes"]
    },
    decorationDetails: String, // For custom theme input
    candles: {
        type: String,
        required: true,
        enum: ["standard", "fireworks"]
    },
    ageSign: {
        type: Boolean,
        required: true
    },
    ageDetails: Number, // For specifying the age if ageSign is true
    textOnCake: {
        type: Boolean,
        required: true
    },
    cakeTextDetails: String, // For specifying the text if textOnCake is true
    deliveryOrPickup: {
        type: String,
        required: true,
        enum: ["pickup", "delivery"]
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    additionalDetails: String, // For "Anything else we should know?"
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CustomOrder = mongoose.model("CustomOrder", customSchema);

module.exports = CustomOrder;