const Expense=require('../model/expense');
const jwt=require('jsonwebtoken');
const User=require('../model/user');
const sequelize = require('../util/database');
const Downtable=require('../model/downTable');
const AWS = require('aws-sdk');
require ('dotenv').config();

exports.addExpense= async (req,res,next)=>{
  const t= await sequelize.transaction();
  const { category, amount, description } = req.body;
const total=Number(req.user.amounts)+Number(amount);
try
{
  await User.update(
  {
    amounts:total }, {
      where: { id:req.user.id},
    transaction : t})   
 const result=await req.user.createExpense({
category,
amount,
description},
{transaction : t}
  )

//                                          Expense.create({
//                                           category,
//                                             amount,
//                                           description,      
//                                           user1Id:req.user.Id
//                                                })
  await t.commit();
  res.status(200).json(result);
}
catch(error)
  { await t.rollback();
    console.log(err);
}
}
exports.getExpenseByPk = async(req,res,next)  =>{
  try{
    const id=req.header('authorization');
     let result= await Expense.findByPk(id);
       res.status(200).json(result); 
     }
    catch(err)
         {
          console.log(err);
         }
            }

exports.editExpense= async(req,res,next)=>{
   const ide=req.params.Nid;
    const category=req.body.category;
    const price=req.body.amount;
    const description=req.body.description; 
   await Expense.findByPk(ide)   
    .then((data)=>
    {
         data.category=category;
        data.amount=price;
        data.description=description;
        return data.save();
    })
    .then(result=>
        {
          res.status(200).json((result));
        })
    .catch(err=>console.log(err));
    }

 exports.getExpense = async(req,res,next)  =>{
  const page=req.query.page || 1;
  const lim=req.query.limit || 2;
    try{
       let result=await req.user.getExpenses({
        offset : Number(Number(page)-Number(1)) * Number(lim),
        limit : Number(lim)
       })
        const count=await req.user.countExpenses();
       let prev;
       let nex;
       const curr=page;
       const hasPre=page>1;
       if(hasPre)
       {
       prev=Number(page)-Number(1);
       }
       const hasNex=(page*lim)<count;
       if(hasNex)
       {
       nex=Number(page)+Number(1);
          }
       const pagination={
        hasPre,
        hasNex,
        prev,
        nex,
        curr
       }
        res.status(200).json({data:result, pagination:pagination}); 
     }
    catch(err)
         {
          console.log(err);
         }
            }
   
  exports.deleteExpense= async(req,res,next)=>{
    const idd=req.params.Nid;    
    const t= await sequelize.transaction(); 
    try{
        const exp = await Expense.findByPk(idd); 
       const newamounts= Number(req.user.amounts)-Number(exp.amount);
          await User.update({
          amounts : newamounts},
         { where: { id:req.user.id },
            transaction : t
               })                   //  Info.findByPk(idd)
            Expense.destroy({ where: { Id: idd, user1Id: req.user.id} })   //.then(product=> 
                                                  //  {return product.destroy()})
                                                  //.then(result=>
                                                  //{console.log("deleted");
          await t.commit();
            res.status(200).send('deleted');
              }
             catch(error)
             {
              await t.rollback();
              console.log(err);
             }
            }


            //UPLOAD TO AWS S3
            function uploadtoS3(data,filename)
            {
      const BUCKET_NAME = 'expensedown';
      const IAM_USER_KEY= process.env.key;
      const IAM_USER_SECRET=process.env.secret;
            

            let s3bucket=  new AWS.S3({
              accessKeyId:IAM_USER_KEY,
              secretAccessKey:IAM_USER_SECRET,
              //Bucket:BUCKET_NAME
            })

                var params = {
                Bucket:BUCKET_NAME,
                Key:filename,
                Body:data,
                ACL: 'public-read'
              }
              return new Promise((res,rej)=>
              {
                s3bucket.upload(params, (err,s3response)=>
              {
                if(err)
                {
                 rej(err);
                }
                else{
                  res(s3response.Location);
                }
              })
            })
          }
 
       exports.download= async(req,res,next)=>
{
 try
  {
  const expen= await req.user.getExpenses();
  const expenJSON= JSON.stringify(expen);
  const date=new Date();
  const filename=`Expense${date}.txt`;
  const fileURL= await uploadtoS3(expenJSON,filename);
  req.user.createDowntable({
    url:fileURL
  })
  const downlist = await req.user.getDowntables();
  res.status(200).json({fileURL, list:downlist, success:true});
  } 
  catch(error)
  {
    console.log(error)
    res.status(500).json({success:false, fileURL:'', err:error})
  }
  } 