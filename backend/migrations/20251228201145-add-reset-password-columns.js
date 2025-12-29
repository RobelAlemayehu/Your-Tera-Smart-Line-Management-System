'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'reset_code', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'reset_expiry', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'reset_code');
    await queryInterface.removeColumn('Users', 'reset_expiry');
  }
};
