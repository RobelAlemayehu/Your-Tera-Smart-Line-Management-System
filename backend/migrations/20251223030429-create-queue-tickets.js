'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Queue_Tickets', {
      ticket_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Services', key: 'service_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ticket_number: {
        type: Sequelize.STRING, // Changed to STRING for prefixes like "PA-101"
        allowNull: false
      },
      phone_number: { // NEW: Destination for Traccar SMS
        type: Sequelize.STRING,
        allowNull: false
      },
      position: { // NEW: Used to calculate the "5 people left" alert
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Waiting', 'Serving', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Waiting'
      },
      issued_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Queue_Tickets');
  }
};