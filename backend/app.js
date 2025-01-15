//backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); // For environment variables
const path = require('path'); // Required for file path handling

const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const carRoutes = require('./routes/carRoutes');
const flatRoutes = require('./routes/flatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminMiddleware = require('./middleware/authMiddleware');

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Built-in middleware for parsing JSON bodies
app.use(express.urlencoded({ extended: true })); // Built-in middleware for parsing URL-encoded bodies

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cars',carRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/flat', flatRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack // Only show stack trace in development
    });
});

// Export the app for use in the server file
module.exports = app;