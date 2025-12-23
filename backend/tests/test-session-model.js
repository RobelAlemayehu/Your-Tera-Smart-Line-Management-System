const { User, Session, sequelize } = require('../models');
const crypto = require('crypto');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    // 1. Create a User for the session
    const user = await User.create({
      phone_number: `session_test_${Date.now()}`,
      role: 'Customer'
    });

    // 2. Create a Session
    // We set expiry to 24 hours from now
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);

    const newSession = await Session.create({
      session_token: crypto.randomBytes(32).toString('hex'),
      user_id: user.user_id,
      expiry: expirationDate
    });

    console.log('Session Created:');
    console.log({
      token: newSession.session_token.substring(0, 10) + '...',
      user_id: newSession.user_id,
      expires: newSession.expiry
    });

    // 3. Verify retrieval
    const foundSession = await Session.findByPk(newSession.session_token);
    console.log('Session verified in DB:', !!foundSession);

    process.exit(0);
  } catch (error) {
    console.error('Session Test Failed:', error);
    process.exit(1);
  }
})();