const { Office, Service, sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    // 1. Create a parent Office
    const testOffice = await Office.create({
      office_name: `Main Branch ${Date.now()}`,
      location: 'Addis Ababa'
    });
    console.log('Office created for service test');

    // 2. Create the Service linked to that Office
    const testService = await Service.create({
      office_id: testOffice.office_id,
      service_name: 'ID Renewal',
      avg_wait_time: 45,
      is_active: true
    });

    console.log('🛠️ Service created:', testService.toJSON());

    // 3. Verify association (Optional)
    const foundService = await Service.findOne({
      where: { service_id: testService.service_id }
    });
    console.log('Verified Service:', foundService.service_name);

    process.exit(0);
  } catch (error) {
    console.error('Service Test Failed:', error);
    process.exit(1);
  }
})();