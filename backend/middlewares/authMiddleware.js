'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();
const sessionService = require('../services/sessionService');
/**
 * Fallback to different spelling of 'SECRET' to prevent crashes,
 * but ensure your .env file uses JWT_SECRET.
 */
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE;

// Check if secret exists on startup
if (!JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET environment variable is not defined!');
}

/**
 * Main Authentication Middleware
 * This will extract the 'id' and 'role' from the token and attach it to req.user
 */
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No Token Provided" });

    try {
        // 1. Check if session exists in DB
        const validSession = await sessionService.isValidSession(token);
        if (!validSession) {
            return res.status(401).json({ message: "Session expired or logged out" });
        }

        // 2. Verify JWT using the constant defined at the top
        const verified = jwt.verify(token, JWT_SECRET); 
        req.user = verified;
        next();
    } catch (error) {
        // If the token is expired according to JWT logic, this block catches it
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = verifyToken;