const express = require('express');
const router = express.Router();
const connection = require('./db');

// Route to create a product with base64 image upload
router.post('/productCreate', (req, res) => {
    const { productName, productType, stock, price, image } = req.body;

    // Check if base64 image was provided
    if (!image) {
        return res.status(400).json({ message: 'No image uploaded' });
    }

    // Convert base64 string to Buffer
    const imageBuffer = Buffer.from(image, 'base64');

    const query = 'INSERT INTO addproduct (productName, productType, stock, price, image) VALUES (?, ?, ?, ?, ?)';

    connection.query(query, [productName, productType, stock, price, imageBuffer], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Database error');
            return;
        }
        res.json({ message: 'Product created successfully', userId: results.insertId });
    });
});

module.exports = router;
