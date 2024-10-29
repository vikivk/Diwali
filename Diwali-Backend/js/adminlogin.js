// adminlogin.js
const express = require('express');
const router = express.Router();
const connection = require('./db'); // Import the connection from db.js

// Handle POST request for creating a user
router.post('/createUser', (req, res) => {
    const { name, email, pass } = req.body;

    const query = 'INSERT INTO adminlogin (name, email, password) VALUES (?, ?, ?)';
    connection.query(query, [name, email, pass], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Database error');
            return;
        }
        res.json({ message: 'User created successfully', userId: results.insertId });
    });
});

module.exports = router; // Export the router
