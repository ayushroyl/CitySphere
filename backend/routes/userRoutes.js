//backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const API_KEY = process.env.TWO_FACTOR_API_KEY; // 2Factor API Key
const JWT_SECRET = process.env.JWT_SECRET; // JWT Secret for token generation


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


// User Registration (Send OTP)
router.post('/register/send-otp', async (req, res) => {
    try {
        const { mobile } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Send OTP using 2Factor API
        const otpUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/+91${mobile}/AUTOGEN2/`;
        const response = await axios.get(otpUrl);

        if (response.data.Status === 'Success') {
            res.status(200).json({ message: 'OTP sent successfully'});
        } else {
            res.status(400).json({ message: 'Failed to send OTP', error: response.data });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
});

// Verify OTP and Complete Registration
router.post('/register/verify-otp', async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        // Verify OTP using 2Factor API
        const verifyUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY3/${mobile}/${otp}`;
        const response = await axios.get(verifyUrl);

        if (response.data.Status !== 'Success') {
            return res.status(400).json({ message: 'Invalid or expired OTP', error: response.data });
        }

        res.status(201).json({ message: 'OTP verification successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
});

// Register User (Complete Registration)
router.post('/register', async (req, res) => {
    try {
        const { name, mobile, password } = req.body;

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user object
        const newUser = new User({ name, mobile, password: hashedPassword, isVerified: true });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '10d' });

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully', token, userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});


// Forgot Password (Send OTP)
router.post('/forgot-password/send-otp', async (req, res) => {
    try {
        const { mobile } = req.body;

        // Check if user exists
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Send OTP using 2Factor API
        const otpUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/+91${mobile}/AUTOGEN2`;
        const response = await axios.get(otpUrl);

        if (response.data.Status === 'Success') {
            res.status(200).json({ message: 'OTP sent successfully', sessionId: response.data.Details });
        } else {
            res.status(400).json({ message: 'Failed to send OTP', error: response.data });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
});

// Verify OTP and Reset Password
router.post('/forgot-password/verify-otp', async (req, res) => {
    try {
        const { mobile, sessionId, otp, newPassword } = req.body;

        // Verify OTP using 2Factor API
        const verifyUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY3/${sessionId}/${otp}`;
        const response = await axios.get(verifyUrl);

        if (response.data.Status !== 'Success') {
            return res.status(400).json({ message: 'Invalid or expired OTP', error: response.data });
        }

        // Hash new password and update user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ mobile }, { password: hashedPassword });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
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