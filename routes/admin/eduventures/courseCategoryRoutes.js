const express=require('express');
const router=express.Router();
const{deleteCategories,addCategory,updateCategory,getCategories}=require('../../../controllers/admin/eduventures/courseCategoryController');
router.get('/',getCategories);
router.post('/new',addCategory);
router.delete('/delete/:id',deleteCategories);
router.put('/update/:id',updateCategory);
module.exports=router;