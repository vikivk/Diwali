const express = require('express');
const router = express.Router();
const connection = require('../db');

// Route to update order status
router.post('/updateOrderStatus', (req, res) => {
    const { invoiceNumber, status } = req.body;

    const updateStatusQuery = `
        UPDATE productOrder
        SET status = ?
        WHERE invoiceNumber = ?`;

    connection.query(updateStatusQuery, [status, invoiceNumber], (err, results) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).send('Database error');
        }

        res.json({ message: 'Order status updated successfully', invoiceNumber, status });
    });
});

module.exports = router;
