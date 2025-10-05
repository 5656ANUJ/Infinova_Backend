const trainingCategoryModel = require('../../../models/trainingCategoryModel');

const mongoose=require('mongoose');
const getTrainingCategory=async(req,res)=>{
    try {
        const categories=await trainingCategoryModel.find({});
        if(categories.length===0){
            return res.status(404).json({message:"No categories found!!"});
        }
        return res.json(categories);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const addTrainingCategory=async(req,res)=>{
    try {
        const{name}=req.body;
        const createdTrainingCategory=await trainingCategoryModel.create({name});
        return res.status(201).json({message:"Category created sucessfully",data:createdTrainingCategory});

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const deleteTrainingCategory=async(req,res)=>{
    try {
        const traningCategoryId=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(traningCategoryId)){
            return res.status(400).json({message:"Invalid Id format"});
        }
        const training=await trainingCategoryModel.findById(traningCategoryId);
        if(!training){
            return res.status(404).json({message:"No category found!"});
        }
        const deletedTrainingCategory=await trainingCategoryModel.findOneAndDelete({_id:traningCategoryId});
        return res.json({message:"Category deleted sucessfully!!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
module.exports={getTrainingCategory,addTrainingCategory,deleteTrainingCategory};
