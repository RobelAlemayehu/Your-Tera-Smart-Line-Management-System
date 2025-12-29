'use strict';
const { User, Accounts, sequelize } = require('../models');
const bcrypt = require('bcryptjs'); 
module.exports = {
    getUserById: async (user_id) => {
        return await User.findByPk(user_id, {
            attributes: ['user_id', 'username', 'email', 'role']
        });
    },

    getAllUsers: async () => {
        return await User.findAll({
            attributes: ['user_id', 'username', 'email', 'role']
        });
    },
updateUser: async (user_id, updateData) => {
        const t = await sequelize.transaction();
        try {
            const userData = {};
            const accountData = {};

            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(updateData.password, salt);
       
                userData.password = hashed;       
                accountData.password_hash = hashed; 
            }

            if (updateData.email) {
                userData.email = updateData.email;
                accountData.email = updateData.email;
            }

            await User.update(userData, { where: { user_id }, transaction: t });
            await Accounts.update(accountData, { where: { user_id }, transaction: t });

            await t.commit();
            return { message: "Update successful" };
        } catch (error) {
            if (t) await t.rollback();
            throw error;
        }
    }
};