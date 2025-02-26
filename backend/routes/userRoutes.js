//backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');  // Import middlewares
const { uploadProfile } = require('../middleware/upload');

const JWT_SECRET = process.env.JWT_SECRET; // JWT Secret for token generation

//upload profile picture
router.post('/profile/picture', authMiddleware, (req, res, next) => {
    uploadProfile(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const profilePictureUrl = `/uploads/profile/${req.file.filename}`;
        const updatedUser = await User.findByIdAndUpdate(req.userId, { profilePic: profilePictureUrl }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile picture uploaded successfully', profilePic: profilePictureUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile picture', error });
    }
});

// Register User (Complete Registration)
router.post('/register', async (req, res) => {
    try {
        const { name, mobile, password } = req.body;
        const user = await User.findOne({ mobile });
        if (user) {
            return res.status(400).json({ message: 'User Already exist' });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user object
        const newUser = new User({ name, mobile, password: hashedPassword, isVerified: true });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '365d' });

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully', token, userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { mobile, password } = req.body;

        const user = await User.findOne({ mobile });
        if (!user || !user.isVerified) {
            return res.status(400).json({ message: 'Invalid credentials or mobile not verified' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '365 days' });
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Check User Existence
router.post("/check", async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).json({ error: "Mobile number is required." });
    }

    try {
        const user = await User.findOne({ mobile });
        if (user) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking user:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

// Update Password without old password
router.post("/update-password", async (req, res) => {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
        return res.status(400).json({ error: "Mobile number and password are required." });
    }

    try {
        const user = await User.findOne({ mobile });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return res.json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

// Update User Profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, email, address },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user data', error });
    }
});

// Change User Password
router.put('/profile/password', authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the user by userId (already in req.userId from authMiddleware)
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided old password with the stored hashed password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await User.findByIdAndUpdate(req.userId, { password: hashedPassword });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error });
    }
});

// Get all users (Admin functionality)
router.get('/', adminMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Specific User Profile (Admin functionality)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
});

// Delete User (Admin functionality)
router.delete('/delete/:userId', adminMiddleware, async (req, res) => {  // Use userId in URL params
    const { userId } = req.params; // Get userId from request params

    try {
        const user = await User.findByIdAndDelete(userId);  // Find and delete by userId from URL params

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

module.exports = router;