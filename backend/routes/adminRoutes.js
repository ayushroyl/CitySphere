// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const router = express.Router();

// Create Admin Route
router.post('/create', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("Received request to create admin", { username, password });

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
