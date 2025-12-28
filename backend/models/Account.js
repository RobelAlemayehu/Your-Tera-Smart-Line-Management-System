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
                    model: 'Users',
                    key: 'user_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
            tableName: 'Accounts',
            // Set timestamps to true but tell Sequelize to use your snake_case columns
            timestamps: true,
            underscored: true,
            createdAt: 'created_at', 
            updatedAt: 'updated_at'
        }
    );

    Accounts.associate = function(models) {
        Accounts.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'User'
        });
    };

    return Accounts;
};