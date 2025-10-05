const { default: mongoose } = require('mongoose');
const serviceCategoryModel=require('../../../models/serviceCategoryModel');
const getCategories=async(req,res)=>{
    try {
        const categories=await serviceCategoryModel.find({});
        if(categories.length===0){
            return res.status(404).json({message:"No categories found!!"});
        }
        return res.json({categories})
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const addCategory=async(req,res)=>{
    try {
        const{name}=req.body;
        if (!name || name.trim() === "") {
  return res.status(400).json({ message: "Category name is required." });
}
        const newCategory=await serviceCategoryModel.create({name});
        return res.status(201).json({message:"Category added sucessfully!!",data:newCategory});

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const deleteCategory=async(req,res) =>{
    try {
        const id=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid ID format"});
        }
        const category=await serviceCategoryModel.findById(id);
        if(!category){
            return res.status(404).json({message:"Category not found!"});
        }
        await serviceCategoryModel.findByIdAndDelete(id);
        return res.status(200).json({message:"Category deleted sucessfully!!"});
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
const updateCategory=async(req,res)=>{
    try {
         const id=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid ID format"});
        }
        const category=await serviceCategoryModel.findById(id);
        if(!category){
            return res.status(404).json({message:"Category not found!"});
        }
        const{name}=req.body;
        if(!name || name.trim()===""){
            return res.status(400).json({message:"Categgory name is required!"});
        }
        const updatedCategory=await serviceCategoryModel.findByIdAndUpdate(id,{name},{new:true});
        return res.status(200).json({message:"Category updated sucessfully!",data:updatedCategory});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
module.exports={addCategory,getCategories,deleteCategory,updateCategory};