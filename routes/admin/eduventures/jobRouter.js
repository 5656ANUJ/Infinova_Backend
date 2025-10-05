const express=require('express');
const router=express.Router();
const{getJob,createJob,updateJob,deleteJob}=require("../../../controllers/admin/eduventures/jobController");
router.get("/",getJob);
router.post("/new",createJob);
router.put("/update/:id",updateJob);
router.delete("/delete/:id",deleteJob);
module.exports=router;