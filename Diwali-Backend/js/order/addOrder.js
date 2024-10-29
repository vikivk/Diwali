const express = require('express');
const router = express.Router();
const connection = require('../db'); // Ensure this path is correct

router.post('/addOrder', (req, res) => {
    console.log('Request body:', req.body);

    // Destructure fields from request body
    const { ProductId, ProductName, qty, price, discountedPrice, stock, name, mobile, email, state, district, address, orderDate } = req.body;

    // Define status as 'pending'
    const status = 'pending';
    const invoiceNumber = generateInvoiceNumber(); // Generate an invoice number as per your logic

    // Step 1: Insert data into productOrder table
    const orderQuery = `
    INSERT INTO productOrder (address, district, email, mobile, name, state, invoiceNumber, overallAmount, status, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(orderQuery, [address, district, email, mobile, name, state, invoiceNumber, 0, status, orderDate], (err, orderResults) => {
        if (err) {
            console.error('Error inserting into productOrder:', err);
            return res.status(500).send('Database error');
        }

        // Step 2: Insert data into orderDetails table
        const totalPrice = qty * discountedPrice; // Calculate totalPrice

        const orderDetailsQuery = `
            INSERT INTO orderDetails (invoiceNumber, productId, qty, price, discountedPrice, stock, productName, totalPrice)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(orderDetailsQuery, [
            invoiceNumber, 
            ProductId, 
            qty, 
            price, 
            discountedPrice, 
            stock,
            ProductName,
            totalPrice // Use calculated totalPrice instead of item.totalPrice
        ], (err) => {
            if (err) {
                console.error('Error inserting into orderDetails:', err);
                return res.status(500).send('Database error');
            }

            // Step 3: Update the productOrder table with the overallAmount
            const updateOrderQuery = `
                UPDATE productOrder
                SET overallAmount = ?
                WHERE invoiceNumber = ?`;

            connection.query(updateOrderQuery, [totalPrice, invoiceNumber], (err) => {
                if (err) {
                    console.error('Error updating productOrder with overallAmount:', err);
                    return res.status(500).send('Database error');
                }

                res.json({ message: 'Order placed successfully', invoiceNumber, overallAmount: totalPrice, status });
            });
        });
    });
});

// Function to generate an invoice number (replace this logic as needed)
function generateInvoiceNumber() {
    return 'INV-' + Math.floor(Math.random() * 1000000); // Example invoice number generation
}

module.exports = router;
