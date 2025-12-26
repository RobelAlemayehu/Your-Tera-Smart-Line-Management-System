'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            email: { // Matches your MySQL 'SELECT' result
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            role: {
                type: DataTypes.ENUM('Customer', 'Admin'),
                allowNull: false,
                defaultValue: 'Customer'
            }
            // REMOVE the created_at block from here if it's not in your DB
        },
        {
            tableName: 'Users',
            timestamps: false, // Disables automatic created_at/updated_at checks
            underscored: true
        }
    );

    User.associate = function(models) {
        // Safe association check to prevent the "subclass of Model" error
        if (models.Account) {
            User.hasOne(models.Account, { foreignKey: 'user_id', as: 'account' });
        }
        if (models.QueueTicket) {
            User.hasMany(models.QueueTicket, { foreignKey: 'user_id', as: 'tickets' });
        }
    };

    return User;
};