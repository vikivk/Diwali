const express = require('express');
const router = express.Router();
const connection = require('../db');

// Route to create a product with base64 image upload
router.post('/TypeCreate', (req, res) => {
    const {  productType, location, pack, supplier,discount} = req.body;

    


    const query = 'INSERT INTO addtype ( productType, location, pack, supplier,discount) VALUES (?, ?, ?, ?, ?)';

    connection.query(query, [ productType, location, pack, supplier,discount], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Database error');
            return;
        }
        res.json({ message: 'Product created successfully', userId: results.insertId });
    });
});

module.exports = router;
