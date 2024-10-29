const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/typeDisplay', (req, res) => {
    const query = 'SELECT * FROM addtype';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Database error');
            return;
        }
        
        // Send the results back to the client
        res.json(results);
    });
});

module.exports = router;
