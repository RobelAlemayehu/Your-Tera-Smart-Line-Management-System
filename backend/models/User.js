'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            user_id:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
                allowNUll:false
            },
            phone_number:{
                type:DataTypes.STRING,
                allowNull:false,
                unique:true
            },
            role:{
                type:DataTypes.ENUM('Customer','Admin'),
                allowNull:false,
                defaultValue:'Customer'
            },
            created_at:{
                type:DataTypes.DATE,
                allowNull:false,
                defaultValue:DataTypes.NOW
            }
        },
        {
            tableName:'Users',
            timestamps:false,
            underscored:true
        }
    );

    User.associate = function(models) {
        User.hasOne(models.Accounts, {
            foreignKey: 'user_id',
            as: 'Account'
        });
    };

    return User;
}