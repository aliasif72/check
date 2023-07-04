const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const downtable= sequelize.define(('downtable'), {
    url:Sequelize.STRING
      },
    {
        timestamps:false
    })

module.exports=downtable;