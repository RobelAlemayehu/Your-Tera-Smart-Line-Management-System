'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();
const sessionService = require('../services/sessionService');

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE;

if (!JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET environment variable is not defined!');
}

/**
 * Middleware to verify the JWT and check session validity
 */
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No Token Provided" });

    try {
        const validSession = await sessionService.isValidSession(token);
        if (!validSession) {
            return res.status(401).json({ message: "Session expired or logged out" });
        }

        const verified = jwt.verify(token, JWT_SECRET); 
        req.user = verified; // This contains user_id and role
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

/**
 * Middleware to restrict access to Admins only
 */
const isAdmin = (req, res, next) => {
    // We check req.user.role which was attached in verifyToken
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: "Access Denied: Admin Role Required" });
    }
};

// CRITICAL FIX: Use Named Exports so the Route file can see both functions
module.exports = {
    verifyToken,
    isAdmin
};