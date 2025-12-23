'use strict';

module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define(
        'Service',

        {
            service_id:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
                allowNull:false
            },

            office_id:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references: {
                    model:'Offices',
                    key: 'office_id'
                },
                onUpdate:'CASCADE',
                onDelete:'CASCADE'
            },

            service_name:{
                type:DataTypes.STRING,
                allowNull:false
            },

            avg_wait_time:{
                type:DataTypes.INTEGER,
                allowNull:false,
                commnet:'Average wait time in minutes'
            },

            is_active:{
                type:DataTypes.BOOLEAN,
                allowNull:false,
                defaultValue:true
            }
        },
        {
            tableName: 'Services',
            timestamps:false,
            underscored:true
        }
    );

    return Service
}