'use strict';
const { Session } = require('../models');

module.exports = {
    /**
     * Create a session in the DB using your specific columns
     */
    createSession: async (userId, token) => {
    try {
        const now = Date.now(); 
        
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const expiryDate = new Date(now + twentyFourHours);

        return await Session.create({
            session_token: token,
            user_id: userId,
            expiry: expiryDate 
        });
    } catch (error) {
        throw new Error('Session Creation Error: ' + error.message);
    }
},

   isValidSession: async (token) => {
    try {
        const session = await Session.findOne({
            where: { session_token: token }
        });

        if (!session) return false;

        const currentTime = Date.now();
        const expiryTime = new Date(session.expiry).getTime();

        return currentTime < expiryTime;
    } catch (error) {
        return false;
    }
},

    deleteSession: async (token) => {
        try {
            return await Session.destroy({
                where: { session_token: token }
            });
        } catch (error) {
            throw new Error('Error deleting session: ' + error.message);
        }
    },

    /**
     * Optional Cleanup: Removes all expired sessions for all users
     */
    clearExpiredSessions: async () => {
        try {
            const { Op } = require('sequelize');
            return await Session.destroy({
                where: {
                    expiry: { [Op.lt]: new Date() }
                }
            });
        } catch (error) {
            console.error('Cleanup Error:', error.message);
        }
    }
};