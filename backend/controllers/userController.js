'use strict';
const { User, Accounts } = require('../models');
// Ensure this filename matches your file in the services folder exactly
const userService = require('../services/userService');

const getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        
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
        // req.user.user_id usually comes from your Auth Middleware/JWT
        const user = await User.findByPk(req.user.user_id, {
            include: [{
                model: Accounts,
                as: 'Account', 
                attributes: ['email']
            }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Accounts,
                as: 'Account',
                attributes: ['email']
            }]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateProfile = async (req, res) => {
    try {
        // Use the ID from the authenticated token (req.user.user_id)
        // or from the URL (req.params.id) depending on your needs
        const user_id = req.user.user_id;
        
        if (!user_id) {
            return res.status(401).json({ error: "Unauthorized: No user ID found in token" });
        }

        // Pass the user_id from the token to your service
        const result = await userService.updateUser(user_id, req.body);
        
        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exporting as an object so the Router can see all functions
module.exports = {
    getUserProfile,
    getProfile,
    getAllUsers,
    updateProfile
};