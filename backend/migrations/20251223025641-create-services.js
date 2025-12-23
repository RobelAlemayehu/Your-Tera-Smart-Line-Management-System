'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Services', {
      service_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      office_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Offices',
          key: 'office_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      service_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      avg_wait_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Average wait time in minutes'
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Services');
  }
};
