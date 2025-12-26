const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await User.create({ ...userData, password: hashedPassword });
};

exports.login = async (email, password) => {
    // 1. Find the Account AND the associated User profile
    const account = await Accounts.findOne({ 
        where: { email },
        include: [{ 
            model: User, 
            as: 'User', 
            attributes: ['user_id', 'role', 'username'] 
        }] 
    });

    // 2. Check if the account exists
    if (!account || !account.User) {
        throw new Error('Invalid credentials');
    }

    // 3. Verify the password against the hash in the Accounts table
    const isMatch = await bcrypt.compare(password, account.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // 4. Generate the token manually if you don't have a helper function
    const token = jwt.sign(
        { id: account.User.user_id, role: account.User.role }, 
        process.env.JWT_SECRET || process.env.JWT_SECRETE, 
        { expiresIn: '1d' }
    );

    return { user: account.User, token };
};