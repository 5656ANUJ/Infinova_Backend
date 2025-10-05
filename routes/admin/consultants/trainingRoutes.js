const express=require('express');
const router=express.Router();
const{getTrainings,addTraining,updateTraining,deleteTraining}=require('../../../controllers/admin/consultants/trainingController');
router.get('/',getTrainings);
router.post('/new',addTraining);
router.put('/update/:id',updateTraining);
router.delete('/delete/:id',deleteTraining);
module.exports=router;
