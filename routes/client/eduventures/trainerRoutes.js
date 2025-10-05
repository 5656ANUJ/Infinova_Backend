const{getTrainers}=require("../../../controllers/client/eduventures/trainerController")
const express=require('express')
const router=express.Router();
router.get('/',getTrainers);
module.exports=router;