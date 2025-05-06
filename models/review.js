const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    headline: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model
      required: true
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;