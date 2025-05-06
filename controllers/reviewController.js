const Review = require('../models/review');

const review_index = (req, res) => {
  Review.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email') // Populate user field to get name or email
      .then(result => {
          res.render('reviews/index', {
              title: 'Every Bite is a Moment of Pure Delight',
              reviews: result
          });
      })
      .catch(err => {
          console.log(err);
      });
};

const review_details = (req, res) => {
  const id = req.params.id;

  Review.findById(id)
    .populate('user') // Populate userId to get the user's name and email
    .then(result => {
      if (!result) {
        return res.status(404).render('404', { title: 'Review not found' });
      }

      res.render('reviews/details', {
        review: result,
        user: req.user, // Pass the logged-in user
        title: 'Review Details',
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).render('404', { title: 'Review not found' });
    });
};

const review_create_get = (req, res) => {
    res.render('reviews/create', { title: 'Create a Review' });
}

const review_create_post = (req, res) => { 
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in to submit a review." });
  }

  const review = new Review({
    headline: req.body.headline,
    snippet: req.body.snippet,
    rating: req.body.rating,
    user: req.user._id, // Ensure the review is linked to the authenticated user
  });

  review.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Failed to submit review." });
    });
};

const review_delete = async (req, res) => {
  try {
      const id = req.params.id;
      const review = await Review.findById(id);

      if (!review) {
          return res.status(404).json({ error: "Review not found" });
      }

      if (review.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({ error: "Unauthorized to delete this review" });
      }

      await Review.findByIdAndDelete(id);
      res.json({ redirect: '/' });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
    review_index, 
    review_details, 
    review_create_get, 
    review_create_post, 
    review_delete
}