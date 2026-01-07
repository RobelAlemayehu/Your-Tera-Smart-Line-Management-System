'use strict';

const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
    // Get user profile
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.user_id).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const { fullname, email, phone_number } = req.body;
            const userId = req.user.user_id;

            // Build update object with only provided fields
            const updateData = {};
            
            if (fullname && fullname.trim()) {
                updateData.fullname = fullname.trim();
            }
            
            if (email && email.trim()) {
                const emailLower = email.toLowerCase().trim();
                // Check if email is being changed and if it already exists
                const existingUser = await User.findOne({ 
                    email: emailLower, 
                    _id: { $ne: userId } 
                });
                if (existingUser) {
                    return res.status(400).json({ error: 'Email already registered' });
                }
                updateData.email = emailLower;
            }
            
            if (phone_number && phone_number.trim()) {
                const phoneTrimmed = phone_number.trim();
                // Check if phone number is being changed and if it already exists
                const existingPhone = await User.findOne({ 
                    phone_number: phoneTrimmed, 
                    _id: { $ne: userId } 
                });
                if (existingPhone) {
                    return res.status(400).json({ error: 'Phone number already registered' });
                }
                updateData.phone_number = phoneTrimmed;
            }

            // If no fields to update
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'No valid fields provided for update' });
            }

            const user = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'Profile updated successfully', user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Change password
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body;
            const userId = req.user.user_id;

            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ error: 'All password fields are required' });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: 'New passwords do not match' });
            }

            const user = await User.findById(userId).select('+password');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedNewPassword;
            await user.save();

            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};