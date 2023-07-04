const Sequelize=require('sequelize');
const sequelize= require('../util/database');

const Request= sequelize.define('request',
{
    id:{
        type: Sequelize.STRING,
        primaryKey:true,
        allowNull:false,
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        defaultValue: false
}},
{
    timestamps:false
}
)

module.exports=Request;
