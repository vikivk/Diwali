const express = require('express');
const router = express.Router();
const connection = require('../db'); 

// DELETE route for deleting a product by its ID
router.delete('/typeDelete/:typeId', (req, res) => {
    const typeId = req.params.typeId; // Get the productId from the URL parameter

    // Ensure that productId is not null
    if (!typeId) {
        res.status(400).send('Product type ID is required');
        return;
    }

    // SQL query to delete the product based on productId
    const query = 'DELETE FROM addtype WHERE typeId = ?';

    connection.query(query, [typeId], (err, results) => {
        if (err) {
            console.error('Error deleting data:', err.message); // Log the error message
            res.status(500).json({ error: 'Database error', details: err });
            return;
        }
        

        if (results.affectedRows === 0) {
            res.status(404).send('Product type not found');
        } else {
            res.json({ message: 'Product type deleted successfully' });
        }
    });
});

module.exports = router;
