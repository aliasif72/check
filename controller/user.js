const User1=require('../model/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
 require('dotenv').config();

exports.signup=async (req,res,next)=>
{
    const { name,email,password } = req.body;
    const exist= await User1.findOne({where:{email:email}})
       if(exist)
    {
        console.log("failed");
         return res.status(403).json("User already exist!!");
    }
    const saltRounds=10;
    bcrypt.hash(password,saltRounds,(err,hash)=>
    {
     User1.create({
       name:name,
        email:email,
        password:hash
    })
   .then(resp=>res.status(201).json("Sign up successful!!"))
    .catch(err=>console.log(err));
})
}

    //function for creating token
    function generateToken(id, name ,isPremium)
    {
         return jwt.sign( {userId: id, name: name, isPremium:isPremium }, 'asifali' );
    }

exports.login = async(req,res,next)=>
{
    const {email,password } = req.body;
    await User1.findAll({where:{email:email}})
   .then(exist=>
    { 
        if(exist[0]==undefined)//or(exist.length<1) so, yaha pe exist=[], exist[0]=undefined dega console krne pe
        {
            return res.status(404).json("User doesn't exist");
        }
        bcrypt.compare(password,exist[0].password,(err,result)=>{
          if(result)
          {
            //return res.status(201).json({message:"Login success", dataa:exist[0]});
            return res.status(201).json({message:"Login success" , token:generateToken(exist[0].id, exist[0].name, exist[0].isPremium) });
          }
          return res.status(401).json("User not authorized");
        });
    })
    .catch(err=>console.log(err));
}



