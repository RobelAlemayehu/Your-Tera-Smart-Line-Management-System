'use strict';

require('dotenv').config();
const { User, Accounts, Session, sequelize } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE;
const sessionService = require('../services/sessionService');
const emailService = require('../services/emailService');
module.exports = {
    register: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { phone_number, fullname, password } = req.body; 
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                phone_number,
                fullname,
                username: fullname,
                password: hashedPassword, 
                role: 'Customer',
            }, { transaction: t });

            await Accounts.create({
                user_id: newUser.user_id,
                email: null,
                password_hash: hashedPassword
            }, { transaction: t });

            await t.commit();
            res.status(201).json({ message: "User and Account created successfully!" });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ error: error.message });
        }
    },

    login: async (req, res) => {
    try {
        const { phone_number, password } = req.body;
    
        const user = await User.scope('withPassword').findOne({
            where: { phone_number }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        await sessionService.createSession(user.user_id, token);

        return res.status(200).json({
            message: "Login Successfully!",
            token,
            user: { user_id: user.user_id, role: user.role }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
},
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

forgotPassword: async (req, res) => {
    const { phone_number } = req.body;
    try {
        const user = await User.findOne({ where: { phone_number } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const code = Math.floor(1000 + Math.random() * 9000).toString();

        user.reset_code = code; 
        user.reset_expiry = new Date(Date.now() + 10 * 60 * 1000);
        
        await user.save();

        // TODO: Send SMS instead of email
        // await smsService.sendVerificationCode(phone_number, code);
        res.json({ message: "Code sent successfully!", code }); // Remove code from response in production
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},
  verifyResetCode: async (req, res) => {
    try {
        const { phone_number, code } = req.body;
        const user = await User.findOne({ 
    where: { 
        phone_number: phone_number, 
        reset_code: code
    } 
});

        if (!user || user.reset_expiry < Date.now()) {
            throw new Error("Invalid or expired code.");
        }

        res.status(200).json({ message: "Code verified. You may now reset your password." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  },

resetPassword: async (req, res) => {
    const { phone_number, code, newPassword } = req.body;
    const t = await sequelize.transaction(); 

    try {

        const user = await User.findOne({ where: { phone_number, reset_code: code } });

        if (!user || user.reset_expiry < Date.now()) {
            return res.status(400).json({ error: "Unauthorized or code expired." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);

        user.password = hashed;
        user.reset_code = null;
        user.reset_expiry = null;
        await user.save({ transaction: t });

        await Accounts.update(
            { password_hash: hashed }, 
            { where: { user_id: user.user_id }, transaction: t }
        );

        await t.commit();
        res.json({ message: "Password has been reset successfully. You can now login." });

    } catch (error) {
        if (t) await t.rollback();
        res.status(500).json({ error: error.message });
    }
  }
};