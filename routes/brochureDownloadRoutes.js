const express=require('express');
const{downloadBrochure}=require('../controllers/brochureDownloadController')
const router=express.Router();
router.post('/',downloadBrochure)
module.exports=router