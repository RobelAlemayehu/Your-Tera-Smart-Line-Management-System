'use strict';

module.exports = (sequelize, DataTypes) => {
    const Accounts = sequelize.define(
        'Accounts',
        {
            account_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', 
                    key: 'user_id'
                }
            },
        
            password_hash: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            }
        },
        {
            tableName: 'accounts', 
            timestamps: false 
        }
    );

    Accounts.associate = function(models) {
        Accounts.belongsTo(models.User, { foreignKey: 'user_id', as: 'user_details' });
    };

    return Accounts;
};