'use strict';
const { Session } = require('../models');
const mongoose = require('mongoose');

module.exports = {
    /**
     * Create a session in the DB using your specific columns
     */
    createSession: async (userId, token) => {
        try {
            const now = Date.now(); 
            const twentyFourHours = 24 * 60 * 60 * 1000;
            const expiryDate = new Date(now + twentyFourHours);

            // ✅ FIX: Added the 'new' keyword to the constructor
            const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
                ? new mongoose.Types.ObjectId(userId) 
                : userId;

            const session = new Session({
                session_token: token,
                user_id: userObjectId,
                expiry: expiryDate 
            });
            return await session.save();
        } catch (error) {
            // This will now capture and report more specific Mongoose errors
            throw new Error('Session Creation Error: ' + error.message);
        }
    },

    isValidSession: async (token) => {
        try {
            const session = await Session.findOne({
                session_token: token
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
            return await Session.deleteOne({
                session_token: token
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
            return await Session.deleteMany({
                expiry: { $lt: new Date() }
            });
        } catch (error) {
            console.error('Cleanup Error:', error.message);
        }
    }
};
