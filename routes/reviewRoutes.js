const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Review routes
router.get('/', reviewController.review_index);

router.post('/reviews', authMiddleware, reviewController.review_create_post);

router.get('/reviews', reviewController.review_create_get);

router.get('/reviews/:id', authMiddleware, reviewController.review_details); 

router.delete('/reviews/:id', authMiddleware, reviewController.review_delete);

module.exports = router;