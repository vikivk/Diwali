require('dotenv').config(); // Load environment variables

const express = require('express');
const router = express.Router();
const connection = require('./db');
const jwt = require('jsonwebtoken');

const SECRET_KEY ='f7fe2b6e7352228aa418ab66d3e8bc7c8a30f708d918ab12357702128ac5bc08'; // Use the secret key from .env

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined'); // This will help detect missing keys
}
router.post('/loginCheck', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM adminlogin WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (error, results) => {
        if (error) {
            return res.status(500).send('Database query error');
        }

        if (results.length > 0) {
            const user = results[0];
            const payload = { id: user.id, email: user.email };

            // Generate the token using the secret key
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

            res.json({
                message: 'Login successful',
                token: token
            });
        } else {
            res.status(401).send('Invalid email or password.');
        }
    });
});

module.exports = router;
