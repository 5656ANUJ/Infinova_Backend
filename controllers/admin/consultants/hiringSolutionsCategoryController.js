const hiringSolutionsCategoryModel = require('../../../models/hiringSolutionsCategoryModel');
const mongoose=require('mongoose');
const addCategory=async(req,res)=>{
    try {
        const{name}=req.body;
       
        
        const newCategory=await hiringSolutionsCategoryModel.create({name});
        return res.status(201).json({message:"Hiring category added sucessfully",data:newCategory});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const deleteCategory=async(req,res)=>{
    try {
        const categoryId=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(categoryId)){
            return res.status(400).json({message:"Invalid Id format"});
        }
        const category=await hiringSolutionsCategoryModel.findById(categoryId);
        if(!category){
            return res.status(404).json({message:"No category found"});
        }
        await hiringSolutionsCategoryModel.findByIdAndDelete(categoryId);
        return res.status(201).json({message:"Category deleted sucessfully!!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const getCategories=async(req,res)=>{
    try {
        const categories=await hiringSolutionsCategoryModel.find({});
        if(categories.length===0){
            return res.status(404).json({message:"No categories found"});
        }
        return res.json(categories)
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
module.exports={getCategories,addCategory,deleteCategory};