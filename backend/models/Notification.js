'use strict';

module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define(
        'Notification',

        {
            notification_id: {
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
                allowNull:false
            },

            user_id:{
                type: DataTypes.INTEGER,
                allowNull:false,
                references: {
                    model: 'Users',
                    key: 'user_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            
            type:{
                type: DataTypes.ENUM('SMS', 'InApp'),
                allowNull:false
            },

            message:{
                type: DataTypes.STRING,
                allowNull:false
            },


            status: {
                type:DataTypes.ENUM('Sent', 'Failed', 'Pending'),
                allowNull:false,
                defaultValue:'Pending'
            },

            created_at: {
                type:DataTypes.DATE,
                allowNull:false,
                defaultValue:DataTypes.NOW
            },

        
        },

        {
            tableName:'Notifications',
            timestamps: false,
            underscored:true
        }

    );

    return Notification
}