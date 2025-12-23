'use strict';

module.exports = (sequelize, DataTypes) => {
    const Accounts = sequelize.define(
        'Accounts',

        {
          account_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
          },
            
          user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Users',
                key:'user_id'
            },
            onUpdate:'CASCADE',
            onDelete:'CASCADE'
          },
          password_hash: {
            type:DataTypes.STRING,
            allowNull:false
          },

          email:{
            type:DataTypes.STRING,
            allowNull:true,
            unique:true
          },

          created_at:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue: DataTypes.NOW
          }
        },
        {
            tableName:'Accounts',
            timestamps:false,
            underscored:true
        }
    );

    Accounts.associate = function(models) {
        Accounts.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'User'
        });
    };

    return Accounts;
}