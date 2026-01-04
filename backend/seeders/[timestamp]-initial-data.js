'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Insert Office
    await queryInterface.bulkInsert('Offices', [{
      office_name: 'Main Branch',
      location: 'Addis Ababa'
    }], {});

    // 2. Insert Service (linked to office_id 1)
    return queryInterface.bulkInsert('Services', [{
      office_id: 1,
      service_name: 'Passport Renewal',
      avg_wait_time: 15,
      is_active: 1
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Services', null, {});
    await queryInterface.bulkDelete('Offices', null, {});
  }
};