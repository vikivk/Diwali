const express = require('express');
const router = express.Router();
const connection = require('./db'); 

// DELETE route for deleting a product by its ID
router.delete('/productDelete/:productId', (req, res) => {
    const productId = req.params.productId; // Get the productId from the URL parameter

    // Ensure that productId is not null
    if (!productId) {
        res.status(400).send('Product ID is required');
        return;
    }

    // SQL query to delete the product based on productId
    const query = 'DELETE FROM addproduct WHERE productId = ?';

    connection.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error deleting data:', err.message); // Log the error message
            res.status(500).json({ error: 'Database error', details: err });
            return;
        }
        

        if (results.affectedRows === 0) {
            res.status(404).send('Product not found');
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
});

module.exports = router;
