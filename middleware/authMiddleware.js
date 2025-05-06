const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.authToken; // Ensure this matches how JWT is stored

        if (!token) {
            return res.redirect('/'); // Redirect to home page if no token
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const user = await User.findById(decoded.id).select('-password'); // Fetch full user info

        if (!user) {
            return res.redirect('/'); // Redirect to home page if user is not found
        }

        req.user = user; // Attach full user to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.redirect('/'); // Redirect to home on token error
    }
};

module.exports = authMiddleware;