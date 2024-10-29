const express = require('express');
const router = express.Router();
const connection = require('./db');

router.get('/productDisplay', (req, res) => {
    const query = 'SELECT * FROM addproduct';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Database error');
            return;
        }

        // Convert the binary image data to base64
        const productsWithBase64Images = results.map(product => {
            return {
                ...product,
                image: product.image ? Buffer.from(product.image).toString('base64') : null // Convert to base64
            };
        });

        res.json(productsWithBase64Images);  
    });
});

module.exports = router;
