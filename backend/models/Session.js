'use strict';

module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define(
        'Session',

        {
            session_token: {
                type: DataTypes.STRING,
                primaryKey:true,
                allowNull:false
            },

            user_id: {
                type:DataTypes.INTEGER,
                allowNull:false,
                references: {
                    model:'Users',
                    key: 'user_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            expiry: {
                type: DataTypes.DATE,
                allowNull:false
            }
        },


        {
            tableName: 'Sessions',
            timestamps:false,
            underscored:true
        }
    );

    return Session
}