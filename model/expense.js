const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const Expense = sequelize.define(('expense'),{
    Id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false

    }},
    {
        timestamps:false
    }

);
module.exports=Expense;