const express = require('express');
const router = express.Router();
const connection = require('./db');

// Handle product retrieval based on one or more product IDs
router.get('/productParticular', (req, res) => {
    const productIds = req.query.ids;  // Get the 'ids' query parameter

    if (!productIds) {
        return res.status(400).send('No product IDs provided');
    }

    const idsArray = productIds.split(',').map(id => id.trim()).filter(id => !isNaN(id)); // Clean and validate IDs

    if (idsArray.length === 0) {
        return res.status(400).send('Invalid product IDs provided');
    }

    const placeholders = idsArray.map(() => '?').join(',');
    const query = `SELECT * FROM addproduct WHERE productId IN (${placeholders})`;

    connection.query(query, idsArray, (err, productResults) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Database error');
        }


        if (productResults.length === 0) {
            return res.status(404).send('No products found');
        }

        // For each product, fetch the corresponding product type details from the addtype table
        const productTypes = productResults.map(product => product.productType);
        const typePlaceholders = productTypes.map(() => '?').join(',');

        const typeQuery = `SELECT * FROM addtype WHERE productType IN (${typePlaceholders})`;

        connection.query(typeQuery, productTypes, (err, typeResults) => {
            if (err) {
                console.error('Error fetching product types:', err);
                return res.status(500).send('Database error');
            }

            // Combine the product results with the type details
            const combinedResults = productResults.map(product => {
                const productTypeDetails = typeResults.find(type => type.productType === product.productType);
                return {
                    ...product,
                    typeDetails: productTypeDetails || null, // Attach type details if available
                    image: product.image ? Buffer.from(product.image).toString('base64') : null // Convert to base64
                };
            });

            res.json({
                total: combinedResults.length,
                products: combinedResults
            });
        });
    });
});

module.exports = router;
