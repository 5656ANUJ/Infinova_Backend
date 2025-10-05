const hiringSolutionsModel=require('../../../models/hiringSolutionsModel');
const cloudinary=require('../../../configs/cloudinary');
const fs=require('fs');
const path=require('path');
const { default: mongoose } = require('mongoose');
const getSolutions=async(req,res)=>{
    try {
        const solutions=await hiringSolutionsModel.find({});
        if(solutions.length===0){
            return res.status(404).json({message:"No solutions found"});
            
        }
        return res.json(solutions);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const addSolutions=async(req,res)=>{
    try {
        const{name,details}=req.body;
        let brochureUrl="";
        let brochurePublicId="";
        if(req.files?.brochure){
            const brochureFile=req.files.brochure;
            const ext=path.extname(brochureFile.name).toLowerCase();
            const allowedExtensions=[".pdf",".docx"];
            if(!allowedExtensions.includes(ext)){
                return res.status(400).json({message:"Unsupported brochure format"});
            }
            const result=await cloudinary.uploader.upload(brochureFile.tempFilePath,{
                folder:"HiringSolutions-brochure",
                resource_type:"raw"});
            brochureUrl=result.secure_url;
            brochurePublicId=result.public_id;
            fs.unlink(brochureFile.tempFilePath,()=>{});
        }
        const newSolution=await hiringSolutionsModel.create({name,details,brochureUrl,brochurePublicId});
        return res.status(201).json({message:"service added sucessfully!",data:newSolution});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }

};
const deleteSolution=async(req,res)=>{
    try {
        const id=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid ID format"});
        }
        const solution=await hiringSolutionsModel.findById(id);
        if(!solution){
            return res.status(404).json({message:"Service not found!"});
        }
        if(solution.brochurePublicId){
            await cloudinary.uploader.destroy(solution.brochurePublicId,{resource_type:"raw"});
        }
        await hiringSolutionsModel.findByIdAndDelete(id);
    return res.json({ message: "Service deleted successfully" });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const updateSolution=async(req,res)=>{
    try {
        const id=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
             return res.status(400).json({message:"Invalid ID format"});
        }
         const solution=await hiringSolutionsModel.findById(id);
        if(!solution){
            return res.status(404).json({message:"Service not found!"});
        }
        const{name,details}=req.body;
        const updatedFields={
            name:name||solution.name,
            details:details||solution.details,
        };
        if(req.files?.brochure){
             const brochure = req.files.brochure;
      const ext = path.extname(brochure.name).toLowerCase();
      const allowed = ['.pdf', '.docx'];
      if (!allowed.includes(ext)) {
        return res.status(400).json({ message: "Unsupported brochure format." });
      }

      if (solution.brochurePublicId) {
        await cloudinary.uploader.destroy(solution.brochurePublicId,{resource_type:"raw"});
      }

      const result = await cloudinary.uploader.upload(brochure.tempFilePath,{folder:"HiringSolutions-brochure",resource_type:"raw"});
      updatedFields.brochureUrl = result.secure_url;
      updatedFields.brochurePublicId = result.public_id;

      fs.unlink(brochure.tempFilePath, () => {});
        }
         const updated = await hiringSolutionsModel.findByIdAndUpdate(id, updatedFields, { new: true });
    return res.status(200).json({ message: "Service updated successfully", data: updated });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
module.exports={addSolutions,getSolutions,deleteSolution,updateSolution};