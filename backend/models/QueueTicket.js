'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QueueTicket extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // Each ticket belongs to ONE User
      QueueTicket.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      // Each ticket belongs to ONE Service (e.g., ID Renewal)
      QueueTicket.belongsTo(models.Service, {
        foreignKey: 'service_id',
        as: 'service'
      });
    }
  }

  QueueTicket.init({
    ticket_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ticket_number: {
      type: DataTypes.STRING, // Using STRING for "ID-101" format
      allowNull: false
    },
    phone_number: { // New field for Traccar
      type: DataTypes.STRING,
      allowNull: false
    },
    position: { // New field for Queue tracking
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Waiting', 'Serving', 'Completed', 'Cancelled'),
      defaultValue: 'Waiting',
      allowNull: false
    },
    issued_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'QueueTicket',
    tableName: 'Queue_Tickets',
    timestamps: false // We use issued_at instead of createdAt/updatedAt
  });

  return QueueTicket;
};