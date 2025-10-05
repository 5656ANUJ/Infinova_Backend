const express=require('express');
const router=express.Router();
const{addTestimonial,getTestimonials,deleteTestimonials, updateTestimonial}=require('../../../controllers/admin/eduventures/testimonialController');
router.get('/',getTestimonials);
router.post('/new',addTestimonial);
router.delete('/delete/:id',deleteTestimonials);
router.put('/update/:id',updateTestimonial);
module.exports=router;