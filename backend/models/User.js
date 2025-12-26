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
            email: { 
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                get() {
                     return "********"; // This hides the real value when reading data
                }
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: true 
            },
            username: {
                type: DataTypes.STRING,
                allowNull: true
            },
            role: {
                type: DataTypes.ENUM('Customer', 'Admin', 'Student'),
                defaultValue: 'Customer'
            }
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
        if (models.Accounts) {
            User.hasOne(models.Accounts, { foreignKey: 'user_id', as: 'account' });
        }
    };

    return User;
};