const express=require('express');
const router=express.Router();
const{addProductCategory,getCategories,deleteProductCategory}=require('../../../controllers/admin/technologies/productCategoryController');
router.get('/',getCategories);
router.post('/new',addProductCategory);
router.delete('/delete/:id',deleteProductCategory);
module.exports=router;