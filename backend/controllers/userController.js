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
        const account = await Accounts.findByPk(req.user.user_id, {
            include: [{
                model: User,
              
                as: 'user_details', 
                attributes: ['username', 'email']
            }]
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    const users = await User.findAll({
        include: [{
            model: Accounts,
            as: 'account', 
            attributes: ['email']
        }]
    });
};
const updateProfile = async (req, res) => {
    try {
       
        const user_id = req.user.user_id;
        
        if (!user_id) {
            return res.status(401).json({ error: "Unauthorized: No user ID found in token" });
        }

        const result = await userService.updateUser(user_id, req.body);
        
        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getUserProfile,
    getProfile,
    getAllUsers,
    updateProfile
};