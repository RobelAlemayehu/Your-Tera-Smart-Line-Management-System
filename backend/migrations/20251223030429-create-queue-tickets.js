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
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Services',
          key: 'service_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      ticket_number: {
        type: Sequelize.STRING,
        allowNull: false
      },

      issued_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      status: {
        type: Sequelize.ENUM('Waiting', 'Serving', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Waiting'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Queue_Tickets');
  }
};
