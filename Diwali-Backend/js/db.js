// db.js
const mysql = require('mysql2');

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'diwali'
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database in db.js');
});

module.exports = connection; // Export the connection object
