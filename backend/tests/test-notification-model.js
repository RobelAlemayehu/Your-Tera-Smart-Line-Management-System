const { User, Notification, sequelize } = require('../models');

(async () => {
  try {
    // 1. Verify Connection
    await sequelize.authenticate();
    console.log('DB connection successful.');

    // 2. Create a User first (required for the foreign key)
    const testUser = await User.create({
      phone_number: `notif_user_${Date.now()}`,
      role: 'Customer'
    });
    console.log('Recipient User created with ID:', testUser.user_id);

    // 3. Create a Notification for that User
    const notif = await Notification.create({
      user_id: testUser.user_id,
      type: 'SMS',
      message: 'Hello! Your turn is coming up in 5 minutes.',
      status: 'Pending'
    });

    console.log('Notification successfully created:');
    console.log({
      id: notif.notification_id,
      type: notif.type,
      message: notif.message,
      status: notif.status,
      created_at: notif.created_at
    });

    // 4. Verification: Fetch from DB
    const foundNotif = await Notification.findByPk(notif.notification_id);
    if (foundNotif) {
      console.log('Database verification: Notification exists in Notifications table.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Notification Test Failed:', error);
    process.exit(1);
  }
})();