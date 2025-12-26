'use strict';

require('dotenv').config();
const { User, Accounts, Session, sequelize } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE;

module.exports = {
    register: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { phone_number, email, username, password, role } = req.body; 
            
            if (!password) {
                return res.status(400).json({ message: "Password is required" });
            }

            const existingAccount = await Accounts.findOne({ where: { email } });
            if (existingAccount) {
                await t.rollback();
                return res.status(400).json({ message: "Email already in use" }); 
            }

            // Create user profile
            const newUser = await User.create({
                phone_number,
                email,
                username,
                password, // Mandatory field in User.js
                role: role || 'Customer',
            }, { transaction: t });

            // Hash password for Accounts table
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create account linked to user
            await Accounts.create({
                user_id: newUser.user_id,
                email,
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
            const { email, password } = req.body;
        
        // 1. Find the account and include the associated User info
        const account = await Accounts.findOne({
            where: { email },
            include: [{ model: User, as: 'User' }]
        });

        if (!account || !account.User) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, account.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        /**
         * 3. Create the token
         * CRITICAL FIX: Use 'id' so it matches what your middleware 
         * and 'getMyStatus' controller are looking for.
         */
        const token = jwt.sign(
            { id: account.user_id, role: account.User.role }, 
            process.env.JWT_SECRET || JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. Handle Session creation
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);

        await Session.create({
            session_token: token,
            user_id: account.user_id,
            expiry: expiryDate
        });

        // 5. Send success response
        res.status(200).json({
            message: "Login Successfully!",
            token,
            user: { 
                id: account.user_id, 
                role: account.User.role 
            }
        });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};