const express=require('express')
const router=express.Router()
const{getCourses}=require('../../../controllers/client/eduventures/newCourseController')
router.get('/',getCourses);
module.exports=router;