// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { adminMiddleware } = require('../middleware/authMiddleware');  // Import middlewares
const Admin = require('../models/Admin');
const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        //console.log("Received request to login admin", { username, password });

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials or mobile not verified' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN, { expiresIn: '365d' });
        res.status(200).json({ token, adminId: admin._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Create Admin Route
router.post('/create', adminMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;

        //console.log("Received request to create admin", { username, password });

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log("Admin already exists");
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully");

        // Create the new admin
        const newAdmin = new Admin({
            username,
            password: hashedPassword
        });

        // Save the new admin to the database
        await newAdmin.save();
        console.log("Admin created successfully");

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error("Error occurred during admin creation:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
