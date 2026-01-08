'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();
const sessionService = require('../services/sessionService');

// Support both spellings just in case, but prioritize the standard one
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE;

if (!JWT_SECRET) {
    console.error('❌ AUTH_ERROR: JWT_SECRET is missing from process.env');
}

/**
 * Middleware to verify the JWT and check session validity
 */
const verifyToken = async (req, res, next) => {
    try {
        // 1. Get the token from the header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Splits "Bearer <token>"

        if (!token) {
            return res.status(401).json({ message: "No Token Provided, authorization denied" });
        }

        // 2. Check session validity (from main)
        // If you haven't built sessionService yet, you can comment these 4 lines out temporarily
        const validSession = await sessionService.isValidSession(token);
        if (!validSession) {
            return res.status(401).json({ message: "Session expired or logged out" });
        }

        // 3. Verify the actual JWT
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 4. Attach user data to the request object
        req.user = decoded; // Contains user_id and role
        next();
    } catch (error) {
        console.error('❌ AUTH_ERROR:', error.message);
        const status = error.name === 'TokenExpiredError' ? 401 : 403;
        res.status(status).json({ message: "Invalid or Expired Token" });
    }
};

/**
 * Middleware to restrict access based on Role
 * This replaces 'isAdmin' with a more flexible version
 */
const isAdmin = (req, res, next) => {
    // We check req.user.role which was attached in verifyToken above
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Staff')) {
        next();
    } else {
        res.status(403).json({ message: "Access Denied: Administrative privileges required" });
    }
};

// Export both so they can be used in your Routes
module.exports = {
    verifyToken,
    isAdmin
};