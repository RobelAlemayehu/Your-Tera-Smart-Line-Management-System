'use strict';

const { DATE } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const QueueTicket = sequelize.define(
        'QueueTicket',

        {
            ticket_id: {
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
                allowNull:false
            },

            user_id: {
                type:DataTypes.INTEGER,
                allowNull:false,
                references: {
                    model: 'Users',
                    key: 'user_id'
                },
                onUpdate:"CASCADE",
                onDelete: 'CASCADE'
            },

            service_id:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references: {
                    model: 'Services',
                    key: 'service_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            ticket_number: {
                type:DataTypes.STRING,
                allowNull:false
            },

            issued_at:{
                type:DataTypes.DATE,
                allowNull:false,
                defaultValue:DataTypes.NOW
            },

            status: {
                type:DataTypes.ENUM('Waiting', 'Serving', 'Completed', 'Cancelled'),
                allowNull:false,
                defaultValue: 'Waiting'
            }

        },
        {
            tableName: 'Queue_Tickets',
            timestamps: false,
            underscored: true
        }

    );

    QueueTicket.associate = function(models) {
        QueueTicket.belongsTo(models.User, { foreignKey: 'user_id', as:'user' });
        QueueTicket.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service'});
    };

    return QueueTicket;
}