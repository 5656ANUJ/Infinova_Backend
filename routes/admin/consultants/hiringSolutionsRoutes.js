const express=require('express');
const router=express.Router();
const{getSolutions,addSolutions,deleteSolution,updateSolution}=require('../../../controllers/admin/consultants/hiringSolutionsController');
router.get('/',getSolutions);
router.post('/new',addSolutions);
router.put('/update/:id',updateSolution);
router.delete('/delete/:id',deleteSolution);
module.exports=router;