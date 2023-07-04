const Razorpay=require('razorpay');
const User=require('../model/user');
const Expense=require('../model/expense');
const Order=require('../model/razor');
const jwt=require('jsonwebtoken');
const userController=require('../controller/user');
const sequelize = require('../util/database');
require ("dotenv").config();    

function generateToken1(id, name ,isPremium)
{
     return jwt.sign( {userId: id, name: name, isPremium:isPremium }, 'asifali' );
}

exports.getCheat = async(req,res,next)  =>{
 try{
      const users=await User.findAll({
         attributes :[ 'name' , 'amounts'],
         order : [ [sequelize.col('amounts'), 'DESC']]
        })
        console.log(users);
        res.status(200).json(users);
    }
    catch(err)
    {
        console.log(err);
    }
}
//         {
//             model : Expense,
//             attributes: []  
//                 }
//     ],
// group : ['user1.id'],
// order : [ [sequelize.col('amount'), 'DESC']]
// });
// console.log(users);
// res.status(200).json(users);
//     }
     
//     exps.forEach((exp)=>
//     {
//         if(obj[exp.user1Id])
//         {
//           obj[exp.user1Id] = obj[exp.user1Id] + exp.amount;    
//     }
//     else{
//         obj[exp.user1Id] = exp.amount;    
//     }
// })
// var userD=[];
// users.forEach((user)=>
// {
//     userD.push({ name : user.name, amount : exps.user1Id || 0})
// });

// userD.sort((a,b)=>b.amount-a.amount);
// res.status(200).json(userD);
// }
    //  catch(err)
    //           {
    //            console.log(err);
    //         }
    //            }
            

exports.buypremium=(req,res,next)=>
{
    try{
        var rzp=new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET
        })
        
        rzp.orders.create({amount:2500,currency:"INR"}, (err,order)=>
    {
        if(err)
        {
            throw new Error(JSON.stringify(err));
        }
                  req.user.createOrder({orderId:order.id, status: 'PENDING'})
        .then(()=>
        {   
               return res.status(201).json({order, key_id : rzp.key_id});
    }) 
    .catch((err)=>
        {
            throw new Error(err);   
        })
    })}
        catch(err)
         {
        console.log(err);
        res.status(403).json({ message: 'something went wrong', error:err})
    }
         }

 exports.updatestatus =  async (req,res,next)=>
         {
            try
            {
            const userId= req.user.id;
            const name=req.user.name;
            const{payment_id, order_id}= req.body;
             const order= await Order.findOne({where:{ orderId:order_id}})
            const promise1 = order.update({paymentid: payment_id, status: 'SUCCESS'});
            const promise2 =req.user.update({isPremium: true});
            Promise.all([promise1,promise2]).then(()=>
            {  
                return res.status(202).json({success:true, message:'Transaction Successful', token: generateToken1(userId, name, true)});
            })
            .catch((err)=>
            {
                throw new Error(err);
            })
         }
         catch(err)
         {
            res.status(404).json({error:err, message: 'Something went wrong'});
         }
        }
      
       