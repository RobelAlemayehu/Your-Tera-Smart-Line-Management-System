const { Office, sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');

    // Create a test office
    // Using Date.now() to avoid Unique Constraint error on office_name
    const testOffice = await Office.create({
      office_name: `Headquarters_${Date.now()}`,
      location: 'Addis Ababa, Ethiopia'
    });

    console.log('Office Created:', testOffice.toJSON());

    // Fetch to verify
    const found = await Office.findByPk(testOffice.office_id);
    console.log('Office verified in DB:', found.office_name);

    process.exit(0);
  } catch (error) {
    console.error('Office Test Failed:', error);
    process.exit(1);
  }
})();