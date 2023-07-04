const express=require('express');
const router=express.Router();

const resetpassword= require('../controller/forgotrequest');

router.use('/forgotpassword',resetpassword.forgotpassword);
router.use('/resetpassword/:uid',resetpassword.resetpassword);
router.use('/updatepassword/:id',resetpassword.updatepassword);
module.exports=router;