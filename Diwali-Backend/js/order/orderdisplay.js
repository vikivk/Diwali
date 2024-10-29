const express = require('express');
const router = express.Router();
const connection = require('../db');

// API to display all order details
router.get('/orderDisplay', (req, res) => {
    const orderQuery = `
        SELECT o.invoiceNumber, o.address, o.district, o.email, o.mobile, o.name, o.state,
               od.productId, od.qty, od.price, od.discountedPrice, od.stock, od.productName,od.totalPrice,o.overallAmount,o.status,o.date
        FROM productOrder o
        JOIN orderDetails od ON o.invoiceNumber = od.invoiceNumber`;

    connection.query(orderQuery, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).send('Database error while fetching orders');
        }

        if (results.length === 0) {
            return res.status(404).send('No orders found');
        }

        // Group orders by invoiceNumber
        const ordersMap = {};
        results.forEach(row => {
            const invoiceNumber = row.invoiceNumber;

            if (!ordersMap[invoiceNumber]) {
                // Initialize new order with details
                ordersMap[invoiceNumber] = {
                    invoiceNumber: row.invoiceNumber,
                    address: row.address,
                    district: row.district,
                    email: row.email,
                    mobile: row.mobile,
                    name: row.name,
                    state: row.state,
                    overallAmount:row.overallAmount,
                    status:row.status,
                    date:row.date,
                    orderItems: []
                };
            }

            // Add each order item to the order's orderItems array
            ordersMap[invoiceNumber].orderItems.push({
                productId: row.productId,
                qty: row.qty,
                price: row.price,
                discountedPrice: row.discountedPrice,
                stock: row.stock,
                productName: row.productName,
                totalPrice:row.totalPrice
            });
        });

        // Convert the ordersMap to an array of orders
        const ordersArray = Object.values(ordersMap);

        // Return the combined order data as the response
        res.json(ordersArray);
    });
});

module.exports = router;
