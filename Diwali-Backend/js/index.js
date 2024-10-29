const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware setup
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'OPTIONS','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Importing the routes
const adminloginRoutes = require('./adminlogin');
const loginRoutes = require('./adminlogincheck');
const productInsertRoutes = require('./productinsert');
const productDisplayRoutes = require('./productDisplay'); // Ensure this file exports correctly
const productUpdateRoutes=require('./productUpdate');
const productDeleteRoutes=require('./productDelete');
const addProductTypeRoutes=require('./addType/insertType'); 
const typeDisplayRoutes=require('./addType/displayType');
const typeUpdateRoutes=require('./addType/updateType');
const typeDeleteRoutes=require('./addType/deleteType');
const particularproductDisplayRoutes=require('./productParticular');
const orderSubmit=require('./order/orderPlace');
const orderDisplay=require('./order/orderdisplay');
const orderStatus=require('./order/orderStatus');
const addOrder=require('./order/addOrder');

// Uncomment if you want to serve the uploads directory


// Useconst cors = require('cors');

app.use(cors()); // Enable CORS

app.use('/', adminloginRoutes);
app.use('/', loginRoutes);
app.use('/', productInsertRoutes);
app.use('/', productDisplayRoutes); 
app.use('/',productUpdateRoutes);
app.use('/',productDeleteRoutes);
app.use('/',addProductTypeRoutes);
app.use('/',typeDisplayRoutes);
app.use('/',typeUpdateRoutes);
app.use('/',typeDeleteRoutes);
app.use('/',particularproductDisplayRoutes);
app.use('/',orderSubmit);
app.use('/',orderDisplay);
app.use('/',orderStatus);
app.use('/',addOrder)


// Make sure productDisplay exports a router

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
