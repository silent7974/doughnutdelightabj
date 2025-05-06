const mongoose = require('mongoose');
const Product = require('./models/product');

require('dotenv').config();

//Connect to mongodb
const dbURI = 'mongodb+srv://Alikakumi:silent7974@cluster0.brv1j.mongodb.net/doughnut-delight?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI)
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// Sample Products
const products = [
    {
        name: 'Ring-shaped Plain Doughnut',
        description: 'Comes in box of 6.',
        price: 3500,
        category: 'Doughnuts',
        image: 'images/ring-doughnut.jpg'
    },

    {
        name: 'Filled Milky Doughnut',
        description: 'Comes in box of 6.',
        price: 6000,
        category: 'Doughnuts',
        image: 'images/milky-doughnut.jpg'
    },

    {
        name: 'Coated and Filled Milky Doughnut (Mini)',
        description: 'Comes in box of 6.',
        price: 4800,
        category: 'Doughnuts',
        image: 'images/mini-coated-milky-doughnut.jpg'
    },

    {
        name: 'Coated and Filled Milky Doughnut (Regular)',
        description: 'Comes in box of 6.',
        price: 5700,
        category: 'Doughnuts',
        image: 'images/regular-coated-milky-doughnut.jpg'
    },

    {
        name: 'Assorted Doughnut',
        description: 'Comes in box of 6.',
        price: 6500,
        category: 'Doughnuts',
        image: 'images/assorted-doughnut.jpg'
    },

    {
        name: 'Assorted Filled Milky Doughnut (Regular)',
        description: 'Comes in box of 6.',
        price: 6500,
        category: 'Doughnuts',
        image: 'images/assorted-filled-doughnut.jpg'
    },

    {
        name: 'Mini tub Milk cake',
        description: '',
        price: 2800,
        category: 'Cakes',
        image: 'images/mini-tub-milkcake.jpg'
    },

    {
        name: 'Regular tub Milk cake',
        description: '',
        price: 3500,
        category: 'Cakes',
        image: 'images/regular-tub-milkcake.jpg'
    },

    {
        name: 'Big tub Milk cake',
        description: '',
        price: 4000,
        category: 'Cakes',
        image: 'images/big-tub-milkcake.jpg'
    },

    {
        name: 'Large tub Mixed flavored Milk cake',
        description: '',
        price: 5000,
        category: 'Cakes',
        image: 'images/large-tub-milkcake.jpg'
    },

    {
        name: 'Vanilla Cup cakes',
        description: 'Comes in box of 12.',
        price: 3000,
        category: 'Cakes',
        image: 'images/vanilla-cup-cakes.jpg'
    },

    {
        name: 'Chocolate Cup cakes',
        description: 'Comes in box of 12.',
        price: 3500,
        category: 'Cakes',
        image: 'images/chocolate-cup-cakes.jpg'
    },

    {
        name: 'Velvet Cup cakes',
        description: 'Comes in box of 12.',
        price: 3500,
        category: 'Cakes',
        image: 'images/velvet-cup-cakes.jpg'
    },

    {
        name: 'Zobo (Hibiscus) Drink',
        description: '',
        price: 500,
        category: 'Beverages',
        image: 'images/zobo.jpg'
    },

    {
        name: 'Ginger Drink',
        description: '',
        price: 500,
        category: 'Beverages',
        image: 'images/ginger.jpeg'
    },

    {
        name: 'Tamarin Drink',
        description: '',
        price: 500,
        category: 'Beverages',
        image: 'images/tamarin.jpg'
    },

    {
        name: 'Cinnamon roll',
        description: 'Comes in box of 6.',
        price: 6500,
        category: 'Others',
        image: 'images/cinnamon-roll.jpg'
    },

    {
        name: 'Meat/Fish pie',
        description: '',
        price: 800,
        category: 'Others',
        image: 'images/meat-pie.jpg'
    },

    {
        name: 'Samosa',
        description: 'Comes in pack of 12.',
        price: 2500,
        category: 'Others',
        image: 'images/samosa.jpg'
    },

    {
        name: 'Spring roll',
        description: 'Comes in pack of 12.',
        price: 2500,
        category: 'Others',
        image: 'images/spring-roll.jpg'
    },

    {
        name: 'Naan Bread',
        description: '',
        price: 500,
        category: 'Others',
        image: 'images/naan-bread.jpg'
    },

    {
        name: 'Chapati',
        description: '',
        price: 300,
        category: 'Others',
        image: 'images/chapati.jpg'
    },

    {
        name: 'Naan Bread with sauce',
        description: '6 pieces with garlic gizzard/kidney sauce',
        price: 6500,
        category: 'Others',
        image: 'images/naan-bread-sauce.jpg'
    },

    {
        name: 'Chapati with sauce',
        description: '6 pieces with garlic gizzard/kidney sauce',
        price: 4500,
        category: 'Others',
        image: 'images/chapati-sauce.jpg'
    },
];

// Seed the database
const seedProducts = async () => {
    try {
        await Product.deleteMany(); // Clear existing products
        await Product.insertMany(products); // Insert new products
        console.log('Seeding successful!');
        mongoose.connection.close(); // Close the connection
    } catch (err) {
        console.log(err);
        mongoose.connection.close();
    }
};

seedProducts();
