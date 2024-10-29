const express = require('express');
const router = express.Router();
const connection = require('./db'); 
router.post('/productUpdate/:id', (req, res) => {
    const productId = req.params.id; // Get the productId from the URL parameter
    const { productName, productType, stock, price, image } = req.body;

    // Ensure that productId is not null
    if (!productId) {
        res.status(400).send('Product ID is required');
        return;
    }

    // SQL query to update the product based on productId
    const query = 'UPDATE addproduct SET productName = ?, productType = ?, stock = ?, price = ?, image = ? WHERE productId = ?';

    connection.query(query, [productName, productType, stock, price, image, productId], (err, results) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Database error');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Product not found');
        } else {
            res.json({ message: 'Product updated successfully' });
        }
    });
});


module.exports = router;
