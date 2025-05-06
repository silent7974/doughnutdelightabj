const bcrypt = require('bcrypt'); // To hash passwords
const jwt = require('jsonwebtoken'); // For generating tokens
const User = require('../models/user');
const Review = require('../models/review');
const CustomOrder = require('../models/custom');
const Cart = require('../models/cart');
const nodemailer = require('nodemailer');

// Helper function to create a token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token valid for 1 day
    });
};


// Validate token route
const validateToken = async (req, res) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(200).json({ authenticated: false, user: null });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token
        const user = await User.findById(decoded.id).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(200).json({ authenticated: false, user: null });
        }

        // Respond with user details
        res.status(200).json({
            authenticated: true,
            message: 'Token is valid',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Token validation error:', error);
        return res.status(200).json({ authenticated: false, user: null });
    }
};


const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // Fetch user details, excluding password

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, phoneNumber, address } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the last update was within a month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        if (user.lastUpdated && user.lastUpdated > oneMonthAgo) {
            return res.status(403).json({ message: "You can only update your profile once a month." });
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email is already in use." });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;
        user.lastUpdated = new Date(); // Store the last updated time

        await user.save();
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// Forgot Password Handler
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Generate a reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email', error });
            } else {
                console.log('Email sent:', info.response);
                return res.status(200).json({ message: 'Password reset link sent to your email' });
            }
        });

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// reset password handler
const resetPassword = async (req, res) => {
    
    console.log('Received token:', req.params.token); // Debugging


    try {
        const { token } = req.params; // Get token from URL
        const { newPassword, confirmPassword } = req.body; // Get new passwords from form input


        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Both password fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded Token:', decoded); // Debugging
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Find user by ID from the decoded token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Signup function
const signup = async (req, res) => {
    try {
        console.log(req.body); // Log the incoming request body

        const { name, email, password } = req.body;

        // validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
        name,
        email,
        password: hashedPassword, // Store hashed password
        });

        // Save user to the database
        await newUser.save();

        // Generate a token
        const token = createToken(newUser._id);

        // Set the token as an HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
        });

        // Respond with success
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Login function
const login = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate a token
        const token = createToken(user._id);

        // Set the token as an HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Respond with the token
        res.status(200).json({
            success: true, 
            message: 'Login successful',
            user: {
                name: user.name,
            }, 
            token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const logout = (req, res) => {
    try {
        // Clear the token cookie (if stored as an HTTP-only cookie)
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        
        
        // Respond with success
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Something went wrong during logout' });
    };
}


const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log("User ID to delete:", userId); // Check if this logs correctly

        // Delete user's reviews
        await Review.deleteMany({ user: userId });

        // Delete user's custom orders
        await CustomOrder.deleteMany({ user: userId });

        // Delete user's cart
        await Cart.deleteMany({ user: userId });


        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userId);

        console.log("Deleted User:", deletedUser); // Check if user is actually deleted

        // Clear authentication cookie
        res.clearCookie('authToken');

        res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Server error. Try again later.' });
    }
};


module.exports = { 
    signup,
    login,
    logout,
    validateToken,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    forgotPassword,
    resetPassword
}