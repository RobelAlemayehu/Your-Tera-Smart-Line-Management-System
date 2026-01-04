'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add fullname column
    await queryInterface.addColumn('Users', 'fullname', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });

    // Make phone_number required and unique
    await queryInterface.changeColumn('Users', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });

    // Make email optional (remove unique constraint and allow null)
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove fullname column
    await queryInterface.removeColumn('Users', 'fullname');

    // Revert phone_number changes
    await queryInterface.changeColumn('Users', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });

    // Revert email changes
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  }
};