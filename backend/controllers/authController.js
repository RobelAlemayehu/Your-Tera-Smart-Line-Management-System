'use strict';

require('dotenv').config();
const { User, Accounts } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sessionService = require('../services/sessionService');

// --- JWT Configuration (Merged Develop & Main) ---
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE || "my_temporary_secret_key_123";

if (JWT_SECRET === "my_temporary_secret_key_123") {
    console.log('⚠️ Using fallback JWT Secret. Check your .env file later.');
} else {
    console.log('✅ JWT Secret loaded successfully!');
}

module.exports = {
    // 1. REGISTER: Creates User and linked Account
    register: async (req, res) => {
        const session = await User.db.startSession();
        session.startTransaction();
        try {
            const { email, fullname, password, confirm_password, phone_number } = req.body;
            
            // Validation
            if (!email || !fullname || !password || !confirm_password || !phone_number) {
                await session.abortTransaction();
                return res.status(400).json({ error: "All fields are required: email, fullname, password, confirm_password, phone_number" });
            }

            // Check if passwords match
            if (password !== confirm_password) {
                await session.abortTransaction();
                return res.status(400).json({ error: "Passwords do not match" });
            }

            // Check if email already exists
            const existingUser = await User.findOne({ email: email.toLowerCase() }).session(session);
            if (existingUser) {
                await session.abortTransaction();
                return res.status(400).json({ error: "Email already registered" });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const newUser = new User({
                email: email.toLowerCase(),
                fullname,
                username: fullname,
                password: hashedPassword,
                phone_number,
                role: 'Customer'
            });
            await newUser.save({ session });

            // Create account
            const newAccount = new Accounts({
                user_id: newUser._id,
                email: email.toLowerCase(),
                password_hash: hashedPassword
            });
            await newAccount.save({ session });

            await session.commitTransaction();
            res.status(201).json({ 
                message: "User registered successfully!",
                user: {
                    email: newUser.email,
                    fullname: newUser.fullname,
                    phone_number: newUser.phone_number
                }
            });
        } catch (error) {
            await session.abortTransaction();
            if (error.code === 11000) {
                // Duplicate key error
                const field = Object.keys(error.keyPattern)[0];
                return res.status(400).json({ error: `${field} already exists` });
            }
            res.status(500).json({ error: error.message });
        } finally {
            session.endSession();
        }
    },

    // 2. LOGIN: Verifies email/password, Signs JWT, and Creates Session
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }
        
            // Use select('+password') to include password field
            const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

            if (!user) {
                return res.status(404).json({ message: "Invalid email or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign(
                { user_id: user._id.toString(), role: user.role }, 
                JWT_SECRET, 
                { expiresIn: '24h' }
            );

            // Record session in DB
            await sessionService.createSession(user._id.toString(), token);

            return res.status(200).json({
                message: "Login Successfully!",
                token,
                user: { 
                    user_id: user._id.toString(), 
                    email: user.email,
                    fullname: user.fullname,
                    phone_number: user.phone_number,
                    role: user.role 
                }
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // 3. LOGOUT: Invalidates the session
    logout: async (req, res) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token) {
                await sessionService.deleteSession(token); 
            }
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 4. FORGOT PASSWORD: Sends reset code to email
    forgotPassword: async (req, res) => {
        const { email } = req.body;
        try {
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }

            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                // Don't reveal if email exists for security
                return res.status(200).json({ 
                    message: "If the email exists, a reset code will be sent." 
                });
            }

            const code = Math.floor(1000 + Math.random() * 9000).toString();
            user.reset_code = code; 
            user.reset_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
            await user.save();

            // TODO: In production, send code via email service
            // For now, return code in response (remove in production!)
            res.json({ 
                message: "Reset code generated! Check your email.",
                code // Remove this in production - only for testing
            }); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 5. VERIFY RESET CODE: Validates the reset code
    verifyResetCode: async (req, res) => {
        try {
            const { email, code } = req.body;
            
            if (!email || !code) {
                return res.status(400).json({ error: "Email and code are required" });
            }

            const user = await User.findOne({ 
                email: email.toLowerCase(), 
                reset_code: code
            });

            if (!user || user.reset_expiry < new Date()) {
                return res.status(400).json({ error: "Invalid or expired code." });
            }

            res.status(200).json({ message: "Reset code verified successfully." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // 6. RESET PASSWORD: Updates password using email and code
    resetPassword: async (req, res) => {
        const { email, code, newPassword } = req.body;
        
        if (!email || !code || !newPassword) {
            return res.status(400).json({ error: "Email, code, and newPassword are required" });
        }

        const session = await User.db.startSession();
        session.startTransaction();
        try {
            const user = await User.findOne({ 
                email: email.toLowerCase(), 
                reset_code: code 
            }).session(session);

            if (!user || user.reset_expiry < new Date()) {
                await session.abortTransaction();
                return res.status(400).json({ error: "Unauthorized or code expired." });
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(newPassword, salt);

            user.password = hashed;
            user.reset_code = null;
            user.reset_expiry = null;
            await user.save({ session });

            // Sync the password in the Accounts table
            await Accounts.updateOne(
                { user_id: user._id }, 
                { password_hash: hashed },
                { session }
            );

            await session.commitTransaction();
            res.json({ message: "Password has been reset successfully." });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ error: error.message });
        } finally {
            session.endSession();
        }
    }
};
