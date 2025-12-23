'use strict';
const jwt = require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE;

// Validate JWT_SECRET is set
if (!JWT_SECRET) {
    console.error('ERROR: JWT_SECRET environment variable is not set!');
}


module.exports = (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        return res.status(401).json({ message: "No token, authorization denied" });
    }



    if (!JWT_SECRET) {
        return res.status(500).json({ 
            message: "JWT_SECRET is not configured." 
        });
    }

    try{

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    }catch (err){
        res.status(401).json({ message: "Token is invalid" });
    }
};
