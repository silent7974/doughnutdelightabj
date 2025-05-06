const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

router.get('/validateToken', authController.validateToken);

router.get('/profile', authMiddleware, authController.getUserProfile,);

router.put('/profile', authMiddleware, authController.updateUserProfile);

router.delete('/deleteAccount', authMiddleware, authController.deleteUser);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;