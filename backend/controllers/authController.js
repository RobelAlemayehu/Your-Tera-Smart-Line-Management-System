'use strict';

require('dotenv').config();

const { where } = require('sequelize');
const { User, Accounts, Session, sequelize } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE;


if (!JWT_SECRET) {
    console.error('ERROR: JWT_SECRET environment variable is not set!');
}

module.exports = {
    // Register: Create User and Account together
    register: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { phone_number, email, password, role } = req.body; 


            // check if the acc is already exist
            const existingAccount = await Accounts.findOne({ where: { email } });
            if (existingAccount) {
                return res.status(400).json({ message: "Email already in use" }); 
            }

            // create user profile
            const newUser = await User.create({
                phone_number,
                role: role || 'Customer',
            }, { transaction: t });

            // hash password

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);


            //create acc linked to user
            await Accounts.create({
                user_id: newUser.user_id,
                email,
                password_hash: hashedPassword
            }, {transaction: t });


            await t.commit();
            res.status(201).json({ message: "User and Account created successfully!" });
        } catch (error){
            await t.rollback();
            res.status(500).json({ error: error.message });
        }
    },


    login: async (req, res) => {

        try{

            const { email, password } = req.body;


            const account = await Accounts.findOne({
                where: { email },
                include: [{ model: User, as: 'User'}]
            });

            if(!account) {
                return res.status(404).json({ message: "User not found" });
            }

            if(!account.User) {
                return res.status(500).json({ message: "User association not found" });
            }

            const isMatch = await bcrypt.compare(password, account.password_hash);
            if(!isMatch){
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Check if JWT_SECRET is configured
            if (!JWT_SECRET) {
                return res.status(500).json({ 
                    error: "JWT_SECRET is not configured." 
                });
            }

            const token = jwt.sign(
                { user_id: account.user_id, role: account.User.role },
                JWT_SECRET, 
                { expiresIn: '24h'}
            );


            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 24);

            await Session.create({
                session_token: token,
                user_id: account.user_id,
                expiry: expiryDate
            });


            res.status(200).json({
                message: "Login Successfully!",
                token,
                user: {
                    id: account.user_id,
                    role: account.User.role
                }
            });



        } catch (error){
            res.status(500).json({ error: error.message });
        }
    }
};
