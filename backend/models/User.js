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
            fullname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone_number: { 
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: { 
                type: DataTypes.STRING,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            username: { type: DataTypes.STRING },
            role: {
                type: DataTypes.ENUM('Customer', 'Admin', 'Student'),
                defaultValue: 'Customer'
            },
            reset_code: { type: DataTypes.STRING(4), allowNull: true },
            reset_expiry: { type: DataTypes.DATE, allowNull: true }
        },
        {
            tableName: 'Users',
            timestamps: false,
            underscored: true,
            defaultScope: {
                attributes: { exclude: ['password'] }
            },
            scopes: {
                withPassword: {
                    attributes: { include: ['password'] }
                }
            }
        }
    );

    User.associate = function(models) {
        User.hasOne(models.Accounts, { foreignKey: 'user_id', as: 'account' });
    };
    return User;
};