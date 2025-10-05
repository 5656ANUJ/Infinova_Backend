const trainingModel=require('../../../models/trainingModel');
const mongoose=require('mongoose');
const fs=require('fs');
const cloudinary=require('../../../configs/cloudinary');
const path=require('path');
const getTrainings=async(req,res)=>{
    try {
        const trainings=await trainingModel.find({});
        if(trainings.length===0){
            return res.status(404).json({messsage:"No trainings found!!"});
        }
        return res.json(trainings);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const addTraining=async(req,res)=>{
    try {
        const{name,details,duration,category,trainer}=req.body;
        let brochureUrl="";
        let brochurePublicId="";
        if(req.files?.brochure){
            const brochureFile=req.files.brochure;
            const ext=path.extname(brochureFile).toLowerCase();
            const allowedExtensions=[".pdf",".docx"];
            if(!allowedExtensions.includes(ext)){
                return res.status(400).json({message:"Unsupported brochure format! "})
            }
            const result=await cloudinary.uploader.upload(brochureFile.tempFilePath,{
                folder:"Training-brochures",
                resource_type:"raw"
            });
            brochureUrl=result.secure_url;
            brochurePublicId=result.public_id;
             fs.unlink(brochureFile.tempFilePath, () => {});

        }
        const newTraining=await trainingModel.create({
            name,
            details,
            duration,
            category,
            trainer,
            brochureUrl,
            brochurePublicId
        });
        const populatedNewCourse=await trainingModel.findById(newTraining._id).populate(trainer).populate(category);
        return res.status(200).json({message:"Training added sucessfully!",data:populatedNewCourse});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const updateTraining=async(req,res)=>{
    try {
        const trainingId=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(trainingId)){
            return res.status(400).json({message:"Invalid Id format!"});
        }
        const training=await trainingModel.findbyId(trainingId);
        if(!training){
            return res.status(404).json({message:"Training not found!"});
        }
        const{name,details,duration,category,trainer}=req.body;
        const updatedFields={
            name:name||training.name,
            details:details||training.details,
            duration:duration||training.duration,
            category:category||training.category,
            trainer:trainer||training.trainer,
            
        };
        if(req.files?.brochure){
            const brochureFile=req.files.brochure;
            const allowedExtensions=[".pdf",".docx"];
            const ext=path.extname(brochureFile).toLowerCase();
            if(!allowedExtensions.includes(ext)){
                return res.status(400).json({message:"Unsupported brochure format"});
            }
            if(training.brochurePublicId){
                await cloudinary.uploader.destroy(training.brochurePublicId);
            }
            const result=await cloudinary.uploader.upload(brochureFile.tempFilePath,{
                folder:"Training-brochures",
                resource_type:"raw"
            });
            updatedFields.brochureUrl=result.secure_url;
            updatedFields.brochurePublicId=result.public_id;
            fs.unlink(brochureFile.tempFilePath,()=>{});
        }
        const updatedTraining=await trainingModel.findByIdAndUpdate(trainingId,updatedFields,{new:true});
        const updatedPopulatedTraining=await trainingModel.findById(updateTraining._id).populate('trainer').populate('category');
         return res.status(200).json({
      message: "Training updated successfully",
      data: updatedPopulatedTraining
    });
 
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const deleteTraining=async(req,res)=>{
    try {
        const trainingId=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(trainingId)){
            return res.status(400).json({message:"Invalid Id format!"});
        }
        const training=await trainingModel.findById(trainingId);
        if(!training){
            return res.status(404).json({message:"Training not found! "});
        }
        if(training.brochurePublicId){
            await cloudinary.uploader.destroy(training.brochurePublicId,{
                resource_type:"raw"
            });
        }
        await trainingModel.findByIdAndDelete(trainingId);
        return res.json({message:"Training deleted sucessfully!"});
    } catch (error) {
         return res.status(500).json({ message: error.message });
    }
};
module.exports={getTrainings,addTraining,updateTraining,deleteTraining};