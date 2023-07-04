const uuid=require('uuid');
const User=require('../model/user');
const bcrypt=require('bcrypt');
const ForgotRequest=require('../model/forgotrequest');
const Sib= require('sib-api-v3-sdk');
require('dotenv').config();
let userid;


exports.forgotpassword = async(req,res,next)=>
{
   const user = await User.findOne({ where : { email : req.body.email} })
           if(user==undefined)
   {
      throw new Error("user not found");
   }
    const id=uuid.v4();
    userid=id;
    user.createRequest( { id , isActive: true })
    .catch((err)=> {
      throw new Error("not valid");
    })
    const client= Sib.ApiClient.instance;
    const apiKey= client.authentications['api-key']
    apiKey.apiKey=process.env.API_KEY;
    
    const transEmail= new Sib.TransactionalEmailsApi();
   
    const sender= {
       email: 'utubepretwo@gmail.com',
       name:'deadpool'
    }
   
    const receiver=[
       {
              email:`${req.body.email}`
       }
    ]
   try
   {
    const result= await transEmail.sendTransacEmail(
       {
           sender,
           to: receiver,
           subject:'Reset Password',
           htmlContent:`<p>Reset your password <a href="http://localhost:3000/called/password/resetpassword/${id}">Click here</a></p>`
       }
    )
    res.status(201).json({message: 'Link to reset password sent to your mail ', success: true});
   }
    catch(error)
    {
       console.log(error);
    }
   }

   exports.resetpassword = async(req,res,next) =>
   {
      try
      {
         const id = req.params.uid;
          const UID= await ForgotRequest.findOne({ where: { id : id}});
          if(UID)
         {
            if(UID.isActive)
            { 
               await UID.update({ isActive: false});
              res.status(200).send(`<html>
              <title>reset password</title>
              <body>
                  <form action="/called/password/updatepassword/${id}" method="GET">
                  <input type="password" name="pass" required>
                  <label for="pass">New Password</label>
                 <input type="submit" value="Reset Password">
              </form>
              </body>
              </html>`)
                        }
                                 else
            {
            throw new Error('isActive is false');
            }
         }
         else
         {
            throw new Error('uuid does not match');
         }
        
          }      
      catch(error)
      {
         console.log(error);
      }
   }

   exports.updatepassword = async (req,res,next)=>
   {
      try
      {
         const id=req.params.id;
         const pass = req.query.pass;
       const uid = await ForgotRequest.findOne({ where: { id: id}});
    const saltrounds=10;
    bcrypt.hash(pass,saltrounds,(err,result)=>
    {
      console.log(result);
      if(err)
      {
         throw new Error('cannot bcrypt & sign')
      }
       User.update({password : result} , {where : { id : uid.user1Id }})
       .then(()=> res.status(201).json({message: 'Successfuly updated the new password'}))
       .catch(err=>console.log(error))});
   }
   catch(error)    
   {
      console.log(error);
         }
}


     
