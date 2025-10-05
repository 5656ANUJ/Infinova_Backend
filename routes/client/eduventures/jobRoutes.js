const express=require('express');
const router=express.Router();
const{getJobs}=require('../../../controllers/client/eduventures/jobsController');
router.get('/',getJobs);
module.exports=router;