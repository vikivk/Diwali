const express = require('express');
const router = express.Router();
const connection = require('../db'); 
router.post('/typeUpdate/:id', (req, res) => {
    const typeId = req.params.id; // Get the productId from the URL parameter
    
    const {  productType, location, pack, supplier,discount} = req.body;
    // Ensure that productId is not null
    if (!typeId) {
        res.status(400).send('Product type ID is required');
        return;
    }

    // SQL query to update the product based on productId
    const query = 'UPDATE addtype SET productType = ?, location = ?, pack = ?, supplier = ?, discount = ? WHERE typeId = ?';

    connection.query(query, [productType, location, pack, supplier, discount, typeId], (err, results) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Database error');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Product type not found');
        } else {
            res.json({ message: 'Product type updated successfully' });
        }
    });
});


module.exports = router;
