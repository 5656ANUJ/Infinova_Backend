const jobModel=require('../../../models/jobModel');
const mongoose=require('mongoose');
const createJob=async(req,res)=>{
try {
        const createdJob=await jobModel.create(req.body);
        res.status(201).json(createdJob);
} catch (error) {
    res.status(500).json({message:error.message});
}
};
const getJob=async(req,res)=>{
    try {
        const data=await jobModel.find();
        
        if(data.length===0){
            return res.json({message:"No jobs found!!"});
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
const updateJob=async(req,res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({message:"Invalid ID format"});
        }
        const updatedJob=await jobModel.findOneAndUpdate({_id:req.params.id},req.body,{new:true});
        if(!updatedJob){
            return res.status(404).json({message:"Job not found!"});
        }
        res.json(updatedJob);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};
const deleteJob=async(req,res)=>{
try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
          return res.status(400).json({message:"Invalid ID format"});
        }
    const deletedJob=await jobModel.findByIdAndUpdate(req.params.id);
      res.json({message:"Job deleted sucessfully"});
} catch (error) {
    res.status(500).json({message:error.message});
}
};
module.exports={
createJob,
getJob,
updateJob,
deleteJob
};                                                                                                                                