const express=require('express');
const router=express.Router();
const{
    createIntership,
    getInternship,
    deleteInternship,
    updateInternship
}=require("../../../controllers/admin/eduventures/internshipController");
const { create } = require('../../../models/intershipModel');
router.get('/',getInternship);
router.post('/new',createIntership);
router.put('/update/:id',updateInternship);
router.delete('/delete/:id',deleteInternship);
module.exports=router;