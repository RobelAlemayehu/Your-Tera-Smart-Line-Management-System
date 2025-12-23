const { User, sequelize } = require('../models');

(async () => {
  try {
    // Check DB connection
    await sequelize.authenticate();
    console.log('DB connected');

    //Check model is loaded
    console.log(' User model loaded:', !!User);

    // Create a test user
    const user = await User.create({
      phone_number: '+251911111111',
      role: 'Customer'
    });

    console.log('User created:', user.toJSON());

    // Fetch user back
    const fetched = await User.findOne({
      where: { phone_number: '+251911111111' }
    });

    console.log('User fetched:', fetched.toJSON());

    process.exit(0);
  } catch (error) {
    console.error('User model test failed:', error);
    process.exit(1);
  }
})();
