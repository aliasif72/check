const Sequelize=require('sequelize');
const sequelize= require('../util/database');

const Order= sequelize.define('order',
{
id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNul:false ,
    primaryKey:true
},
paymentid:Sequelize.STRING,
orderId:Sequelize.STRING,
status:Sequelize.STRING
}, 
{timestamps:false}
)

module.exports=Order;