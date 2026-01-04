'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      user_id: 1,
      username: 'teststudent', 
      email: 'student@university.edu',
      password: 'hashedpassword',
      role: 'Student',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Offices', [{
      office_name: 'Main Registrar',
      location: 'Building A',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    return queryInterface.bulkInsert('Services', [{
      office_id: 1,
      service_name: 'Student ID Renewal',
      avg_wait_time: 15,
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Services', null, {});
    await queryInterface.bulkDelete('Offices', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};