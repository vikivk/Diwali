const crypto = require('crypto');

// Generate a random 32-byte key and convert it to a hex string
const SECRET_KEY = crypto.randomBytes(32).toString('hex');
console.log(SECRET_KEY);
