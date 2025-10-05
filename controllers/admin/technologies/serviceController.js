const serviceModel=require('../../../models/serviceModel');
const mongoose=require('mongoose');
const cloudinary=require('../../../configs/cloudinary')
const path=require('path');
const fs=require('fs');
const getServices=async(req,res)=>{
    try {
        const services=await serviceModel.find({});
        if(services.length===0){
            return res.status(404).json({message:"No services found"});
        }
        return res.json(services);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const addService=async(req,res)=>{
    try {
        const{name,details,cost}=req.body;
        if (!name || !details || !cost) {
  return res.status(400).json({ message: "All fields (name, details, cost) are required." });
}
        const brochureFile=req.files.brochure;
        const allowedExtensions = ['.pdf', '.docx'];
    const ext = path.extname(brochureFile.name).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
          return res.status(400).json({ message: "Unsupported brochure format." });
        }
        const result = await cloudinary.uploader.upload(brochureFile.tempFilePath,{
            folder:"Service-brochures",
            resource_type:"raw"});
        const brochureUrl=result.secure_url;
        const brochurePublicId=result.public_id;
         fs.unlink(brochureFile.tempFilePath,()=>{});
        const newService=await serviceModel.create({
            name,
            details,
            cost,
            brochureUrl,
            brochurePublicId
        });
        return res.status(201).json({message:"Service added sucessfully!!",data:newService});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }

};
const deleteService=async(req,res)=>{
    try {
        const id=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid ID format"});
        }
        const service=await serviceModel.findById(id);
        if(!service){
            return res.status(404).json({message:"Service not found!"});
        }
        if(service.brochurePublicId){
            await cloudinary.uploader.destroy(service.brochurePublicId,{resource_type:"raw"});

        }
        await serviceModel.findByIdAndDelete(id);
        return res.status(200).json({message:"Servive deleted sucessfully!!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const updateService=async(req,res)=>{
    try {
        const id=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid ID format!!"});
        }
        const service=await serviceModel.findById(id);
        if(!service){
            return res.status(404).json({message:"Service not found!!"});
        }
        const{name,details,cost}=req.body;
        let brochureUrl=service.brochureUrl;
        let brochurePublicId=service.brochurePublicId;
        if(req.files?.brochure){
            const brochureFile=req.files.brochure;
            const ALLOWED_EXTENSIONS=[".pdf",".docx"];
            const ext=path.extname(brochureFile.name).toLowerCase();
            if(!ALLOWED_EXTENSIONS.includes(ext)){
                return res.status(400).json({message:"Unsupported brochure format!"});

            }
            if(brochurePublicId){
                await cloudinary.uploader.destroy(brochurePublicId,{resource_type:"raw"});

            }
            const result=await cloudinary.uploader.upload(brochureFile.tempFilePath,{folder:"Service-brochures",resource_type:"raw"});
            brochureUrl=result.secure_url;
            brochurePublicId=result.public_id;
            fs.unlink(brochureFile.tempFilePath,()=>{});

        }
        const updatedService=await serviceModel.findByIdAndUpdate(id,{
            name,
            details,
            cost,
            brochureUrl,
            brochurePublicId
        },{new:true});
        return res.status(201).json({message:"service updated sucessfully!!",data:updatedService});
    } catch (error) {
        
        return res.status(500).json({message:error.message});
    }
};  
module.exports={addService,getServices,deleteService,updateService};