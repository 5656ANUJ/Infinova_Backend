const express=require('express');
const router=express.Router();
const{addCategory,deleteCategory,getCategories}=require('../../../controllers/admin/consultants/hiringSolutionsCategoryController');
router.get('/',getCategories);
router.post('/new',addCategory);
router.delete('/delete/:id',deleteCategory);
module.exports=router;