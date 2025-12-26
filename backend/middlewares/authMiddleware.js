'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();

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
const verifyToken = (req, res, next) => {
    // 1. Get token from the Authorization header
    const authHeader = req.headers['authorization'];
    
    // Support both "Bearer <token>" and just "<token>"
    const token = authHeader && (authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader);

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    // 2. Ensure server is configured
    if (!JWT_SECRET) {
        return res.status(500).json({ message: "Server Configuration Error: JWT_SECRET missing" });
    }

    try {
        // 3. Verify and Decode
        const verified = jwt.verify(token, JWT_SECRET);
        
        /**
         * Based on your login function, this 'verified' object 
         * now contains { id, role }.
         */
        req.user = verified;
        
        next(); // Proceed to the controller
    } catch (error) {
        // Handle expired vs just plain invalid tokens
        const message = error.name === 'TokenExpiredError' 
            ? "Token has expired" 
            : "Invalid Token";
            
        res.status(403).json({ message });
    }
};

module.exports = verifyToken;