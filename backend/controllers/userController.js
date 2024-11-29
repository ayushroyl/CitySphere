// backend/controllers/userController.js
const User = require('../models/User');

// Controller to register a new user
const registerUser = async (req, res) => {
    const { uid, email, name } = req.body;

    try {
        // Check if user already exists in the MongoDB database
        let user = await User.findOne({ uid });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user document in MongoDB
        user = new User({
            uid,
            email,
            address,
            name,
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Controller to get user profile information
const getUserProfile = async (req, res) => {
    try {
        // Assuming req.user is populated by authMiddleware
        const user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Controller to update user profile information
const updateUserProfile = async (req, res) => {
    const { name } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { uid: req.user.uid },
            { name },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User profile updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, getUserProfile, updateUserProfile };