const express=require('express');
const userController=require('../controller/user');


const router=express.Router();
const razorController= require('../controller/razor');
const middle=require('../midleware/auth');
router.get('/getCheat',razorController.getCheat);
router.get('/premium', middle.authenticate, razorController.buypremium);
router.post('/updatestatus', middle.authenticate, razorController.updatestatus);

module.exports=router;