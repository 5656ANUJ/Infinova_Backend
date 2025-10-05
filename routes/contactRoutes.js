const{sendEmail}=require('../controllers/contactController');
const express=require('express');
const router=express.Router();
router.post('/',sendEmail);
module.exports=router;
