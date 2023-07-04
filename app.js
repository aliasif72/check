const express=require('express');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');
const Razorpay=require('razorpay');
const path=require('path');
const fs=require('fs');

const bodyParser = require('body-parser');
const jwt=require('jsonwebtoken');
require ("dotenv").config();
const sequelize = require('./util/database');
//const errorController = require('./controllers/error');
const cors=require('cors');
const userRoutes=require('./route/user');
const expenseRoute=require('./route/expense');
const razorRoute=require('./route/razor');
const forgotRoute=require('./route/forgotrequest');
const User=require('./model/user');
const Expense=require('./model/expense');
const Razor=require('./model/razor');
const Request=require('./model/forgotrequest');
const downtable = require('./model/downTable');
const app= express();

const accessFile= fs.createWriteStream(path.join(__dirname, 'access.log'),{flag:'a'});
//middlewares
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream:accessFile}));
app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/purchase',razorRoute);
app.use('/user/login',expenseRoute);
app.use('/called/password',forgotRoute);

User.hasMany(downtable,{constraints : true, onDelete:'Cascade'});
downtable.belongsTo(User);
User.hasMany(Expense,{constraints :true , onDelete:'Cascade'});
Expense.belongsTo(User);
User.hasMany(Razor,{constraints :true , onDelete:'Cascade'});
Razor.belongsTo(User);
User.hasMany(Request, { constraints:true,onDelete: 'Cascade'});
Request.belongsTo(User);
sequelize
.sync()
.then( app.listen(process.env.PORT || 3000,()=>console.log("server is ON")))
.catch(err=>console.log(err));