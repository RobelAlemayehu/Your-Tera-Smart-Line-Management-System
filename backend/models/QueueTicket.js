'use strict';
module.exports = (sequelize, DataTypes) => {
    const QueueTicket = sequelize.define('QueueTicket', {
        ticket_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Matches the table name
                key: 'user_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Services', // Matches the table name
                key: 'service_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        ticket_number: {
            type: DataTypes.INTEGER, // Changed from STRING to INTEGER to match your auto-increment logic
            allowNull: false
        },
        // issued_at: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        //     defaultValue: DataTypes.NOW
        // },
        status: {
            type: DataTypes.ENUM('Waiting', 'Serving', 'Completed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Waiting'
        }
    }, {
        tableName: 'Queue_Tickets',
        timestamps: true, 
        underscored: true 
    });

    // Correct way to handle associations in Sequelize models
    QueueTicket.associate = function(models) {
        QueueTicket.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        QueueTicket.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
    };

    return QueueTicket;
};