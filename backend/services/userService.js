'use strict';
const { User, Account, sequelize } = require('../models');

module.exports = {
    // Used by GET /api/users/:id and GET /api/users/profile
    getUserById: async (user_id) => {
        return await User.findByPk(user_id, {
            // Explicitly list columns that exist in your DB
            attributes: ['user_id', 'username', 'email', 'role']
        });
    },

    // Used by GET /api/users/all
    getAllUsers: async () => {
        return await User.findAll({
            attributes: ['user_id', 'username', 'email', 'role']
        });
    },

    updateUser: async (user_id, updateData) => {
        // Allowed profile fields (Password is handled separately in Reset Password flow)
        const userFields = ['email', 'username', 'phone_number', 'role'];
        const accountFields = ['email'];

        const t = await sequelize.transaction();

        try {
            // 1. Prepare 'users' table data
            const userData = {};
            userFields.forEach(field => {
                if (updateData[field] !== undefined) userData[field] = updateData[field];
            });

            // 2. Prepare 'accounts' table data (if email is being updated)
            const accountData = {};
            if (updateData.email) accountData.email = updateData.email;

            // 3. Update 'users' table
            if (Object.keys(userData).length > 0) {
                await User.update(userData, { 
                    where: { user_id }, 
                    transaction: t 
                });
            }

            // 4. Update 'accounts' table
            if (Object.keys(accountData).length > 0) {
                await Account.update(accountData, { 
                    where: { user_id }, 
                    transaction: t 
                });
            }

            await t.commit();
            return { message: "Profile updated and synchronized successfully" };

        } catch (error) {
            await t.rollback();
            // This catches the "User not found" or DB mismatch errors
            throw new Error("Update failed: " + error.message);
        }
    }
};