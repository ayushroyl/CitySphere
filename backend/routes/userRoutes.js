//backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Upload Profile Picture
router.post('/profile/picture', authMiddleware, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const profilePictureUrl = `/uploads/${req.file.filename}`;
        const updatedUser = await User.findByIdAndUpdate(req.userId, { profilePic: profilePictureUrl });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ profilePic: profilePictureUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile picture', error });
    }
});


// User Registration
router.post('/register', async (req, res) => {
    try {
        const { isVerified, name, mobile, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, mobile, password: hashedPassword, isVerified });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '10 days' });

        // Return response
        res.status(201).json({ 
            message: 'User registered successfully. Please verify OTP on your mobile.', 
            token, 
            userId: newUser._id 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { mobile } = req.body;

        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ message: 'Register first' });
        }

        user.isVerified = true;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10 days' });
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10 days' });
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all users (Admin functionality)
router.get('/', authMiddleware, async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Get Specific User Profile
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

// Delete User
router.delete('/delete', authMiddleware, async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.userId); // Use req.userId from auth middleware
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
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


module.exports = router;