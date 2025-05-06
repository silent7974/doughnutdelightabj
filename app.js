// Require the express app
const express = require('express');

// Require morgan
const morgan = require('morgan');

//Require mongoose
const mongoose = require('mongoose');

//require review routes
const reviewRoutes = require('./routes/reviewRoutes');

// require authentication routes
const authRoutes = require('./routes/authRoutes');

// require product routes
const productRoutes = require('./routes/productRoutes');

const cartRoutes = require('./routes/cartRoutes');

const paymentRoutes = require("./routes/paymentRoutes");

const checkoutRoutes = require("./routes/checkoutRoutes");

const customRoutes = require('./routes/customRoutes');

// require cookie Parser
const cookieParser = require('cookie-parser');

// We set up the express app
const app = express();

const requireAuth = (req, res, next) => {
  if (!req.cookies.authToken) {
    return res.redirect('/'); // Redirect if not authenticated
  }
  next();
};

// Requiring dotenv
require('dotenv').config();

//Connect to mongodb
const dbURI = 'mongodb+srv://Alikakumi:silent7974@cluster0.brv1j.mongodb.net/doughnut-delight?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI)
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));

app.use(cookieParser());

// Middleware for parsing JSON
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use(morgan('dev'));

//routes
app.get('/custom-order', (req, res) => {
    res.render('custom-order', { title: 'Place your custom Orders' });
});

app.get('/reward', (req, res) => {
    res.render('reward', { title: 'Become our #1 Customer' });
});

app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy', { title: 'Privacy Policy' });
});

app.get('/terms-of-use', (req, res) => {
    res.render('terms-of-use', { title: 'Terms of Use' });
});

app.get('/cookie-preference', (req, res) => {
    res.render('cookie-preference', { title: 'Cookie Preference' });
  });

app.get('/profile', requireAuth, (req, res) => {
  res.render('profile', { title: 'Manage Account' });
});

app.get('/reset-password/:token', (req, res) => {
  res.render('reset', { token: req.params.token });
});

// review routes
app.use(reviewRoutes);

// auth routes
app.use('/api/auth', authRoutes);

// product routes
app.use(productRoutes);

app.use(cartRoutes);

app.use("/payment", paymentRoutes);

app.use(checkoutRoutes);

app.use(customRoutes);

//404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});