const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const User1 = sequelize.define(('user1'), {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:Sequelize.STRING,
    email:Sequelize.STRING,
    password:Sequelize.STRING,
    amounts: {
        type:Sequelize.INTEGER,
        defaultValue: 0
    },
    isPremium:Sequelize.BOOLEAN
        },
        
           {
            timestamps:false
        }
        );
module.exports=User1;