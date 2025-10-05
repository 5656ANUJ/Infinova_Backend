const express=require('express');
const router=express.Router();
const{getCategories,addCategory,deleteCategory,updateCategory}=require('../../../controllers/admin/technologies/serviceCategoryController');
router.get('/',getCategories);
router.post("/new",addCategory);
router.put('/update/:id',updateCategory);
router.delete('/delete/:id',deleteCategory);
module.exports=router;
