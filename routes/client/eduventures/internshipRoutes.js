const{getInternships}=require('../../../controllers/client/eduventures/internshipController');
const express=require('express');
const router=express.Router();
router.get('/',getInternships);
module.exports=router;