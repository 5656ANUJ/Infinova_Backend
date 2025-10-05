const express=require('express');
const router=express.Router();
const{getTrainers,createTrainer,updateTrainer,deleteTrainer}=require('../../../controllers/admin/eduventures/trainerController');

router.get('/',getTrainers);
router.post('/new',createTrainer);
router.put('/update/:id',updateTrainer);
router.delete('/delete/:id',deleteTrainer);
module.exports=router;