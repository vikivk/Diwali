const express = require('express');
const router = express.Router();
const connection = require('../db');
const nodemailer = require('nodemailer'); // Don't forget to require nodemailer
router.post('/orderSubmit', (req, res) => {
    console.log('Request body:', req.body);

    // Destructure fields from request body
    const { 
        address, 
        district, 
        email, 
        mobile, 
        name, 
        state, 
        invoiceNumber, 
        orderItems, 
        orderDate 
    } = req.body;

    const status = 'pending';

    // Step 1: Insert data into productOrder table with initial overallAmount of 0 and status 'pending'
    const orderQuery = `
    INSERT INTO productOrder (address, district, email, mobile, name, state, invoiceNumber, overallAmount, status, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(orderQuery, [address, district, email, mobile, name, state, invoiceNumber, 0, status, orderDate], (err, orderResults) => {
        if (err) {
            console.error('Error inserting into productOrder:', err);
            return res.status(500).send('Database error');
        }

        const orderDetailsQuery = `
            INSERT INTO orderDetails (invoiceNumber, productId, qty, price, discountedPrice, stock, productName, totalPrice)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        let overallAmount = 0;

        const orderDetailsPromises = orderItems.map(item => {
            const totalPrice = item.qty * item.discountedPrice;
            overallAmount += totalPrice;

            return new Promise((resolve, reject) => {
                connection.query(orderDetailsQuery, [
                    invoiceNumber, 
                    item.productId, 
                    item.qty, 
                    item.price, 
                    item.discountedPrice, 
                    item.stock,
                    item.productName,
                    totalPrice
                ], (err) => {
                    if (err) {
                        console.error('Error inserting into orderDetails:', err);
                        return reject(err);
                    }
                    resolve();
                });
            });
        });

        Promise.all(orderDetailsPromises)
            .then(() => {
                // Step 3: Update the productOrder table with the overallAmount
                const updateOrderQuery = `
                    UPDATE productOrder
                    SET overallAmount = ?
                    WHERE invoiceNumber = ?`;

                connection.query(updateOrderQuery, [overallAmount, invoiceNumber], (err, updateResults) => {
                    if (err) {
                        console.error('Error updating productOrder with overallAmount:', err);
                        return res.status(500).send('Database error');
                    }

                    // Aggregate order items for email content
                    const orderSummary = orderItems.map(item => 
                        `Product: ${item.productName}, Quantity: ${item.qty}, Price: ${item.discountedPrice}, Total Price: ${item.qty * item.discountedPrice}`).join('\n');

                    sendOrderEmail({ 
                        name, 
                        email, 
                        invoiceNumber, 
                        overallAmount, 
                        orderSummary 
                    });

                    res.json({ 
                        message: 'Order placed successfully', 
                        invoiceNumber, 
                        overallAmount, 
                        status 
                    });
                });
            })
            .catch(err => {
                console.error('Error inserting order details:', err);
                res.status(500).send('Database error');
            });
    });
});

function sendOrderEmail(orderDetails) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'webuseviki@gmail.com',
            pass: 'jqhe dvui nawj bvgr' // Gmail app password
        }
    });

    const mailOptions = {
        from: 'webuseviki@gmail.com',
        to: orderDetails.email, // Use customer’s email from the request
        subject: `New Order Received: ${orderDetails.invoiceNumber}`,
        text: `
            Dear ${orderDetails.name},
            
            Thank you for placing your order!
            
            Order Summary:
            ${orderDetails.orderSummary}
            
            Total Amount: ${orderDetails.overallAmount}
            Invoice Number: ${orderDetails.invoiceNumber}
            
            We will contact you shortly with more information.
            
            Best regards,
            Your Store
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = router;
