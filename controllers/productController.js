const Product = require('../models/product');

// Get all products and render them in menu.ejs, replacing hardcoded cards
const product_index = async (req, res) => {
    try {
        const products = await Product.find();

        // Group products by category
        const groupedProducts = {};
        products.forEach(product => {
            if (!groupedProducts[product.category]) {
                groupedProducts[product.category] = [];
            }
            groupedProducts[product.category].push(product);
        });

        res.render('menu', { title: 'Our Menu', groupedProducts });
    } catch (error) {
        console.error(error);
        res.status(500).render('500', { title: 'Server Error' });
    }
};

module.exports = {
    product_index
};