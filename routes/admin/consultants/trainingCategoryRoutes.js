const express=require('express');
const router=express.Router();
const{getTrainingCategory,addTrainingCategory,deleteTrainingCategory}=require('../../../controllers/admin/consultants/trainingCategoryController');
router.get('/',getTrainingCategory);
router.post('/',addTrainingCategory);
router.delete('/delete/:id',deleteTrainingCategory);
module.exports=router;
