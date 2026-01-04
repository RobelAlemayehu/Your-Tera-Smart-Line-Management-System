'use strict';
const { User, Accounts } = require('../models');
const mongoose = require('mongoose');

const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get account info if needed
        const account = await Accounts.findOne({ user_id: user._id });
        
        res.status(200).json({
            ...user.toObject(),
            account: account || null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('account', 'email');
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found in token" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const { fullname, email, phone_number } = req.body;
        const updateData = {};

        if (fullname) updateData.fullname = fullname;
        if (email) updateData.email = email.toLowerCase();
        if (phone_number) updateData.phone_number = phone_number;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update account email if email was changed
        if (email) {
            await Accounts.updateOne(
                { user_id: updatedUser._id },
                { email: email.toLowerCase() }
            );
        }

        res.status(200).json({ 
            message: "Profile updated successfully!",
            user: updatedUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserProfile,
    getProfile,
    getAllUsers,
    updateProfile
};
