const express=require('express');
const router=express.Router();
const{addCourse,deleteCourse,updateCourse,getCourses}=require('../../../controllers/admin/eduventures/newCourseController');
router.get('/',getCourses);
router.post('/new',addCourse);
router.delete('/delete/:id',deleteCourse);
router.put('/update/:id',updateCourse);
module.exports=router;