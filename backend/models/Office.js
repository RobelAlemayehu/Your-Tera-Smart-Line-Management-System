'use strict';

module.exports = (sequelize, DataTypes) => {
    const Office = sequelize.define(
        'Office',
        {
            office_id :{
                type: DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
                allowNull:false
            },
            office_name: {
                type:DataTypes.STRING,
                allowNull:false,
                unique:true
            },
            location:{
                type:DataTypes.STRING,
                allowNull:false
            }
        },
        {
            tableName:'Offices',
            timestamps:false,
            underscored:true
        }
    );

    return Office
}