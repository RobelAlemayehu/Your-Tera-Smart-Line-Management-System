const { User, Accounts, sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');

    // 1. Create a parent User first
    const testUser = await User.create({
      phone_number: `test_${Date.now()}`, 
      role: 'Customer'
    });

    // 2. Create the Account linked to that User
    const testAccount = await Accounts.create({
      user_id: testUser.user_id,
      password_hash: 'hashed_password_xyz',
      email: `test_${Date.now()}@example.com` // Unique email every time
    });

    console.log('🚀 Account Created Successfully:', testAccount.toJSON());



    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
})();