const mongoose = require("mongoose");
const productCategoryModel = require("../../../models/productCategoryModel");
const getCategories = async (req, res) => {
  try {
    const categories = await productCategoryModel.find({});
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found!!" });
    }
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const addProductCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existingCategory = await productCategoryModel.findOne({
      name: name.trim(),
    });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const newCategory = await productCategoryModel.create({
      name: name.trim(),
    });
    return res.status(201).json({ message: "Category added sucessfully!!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteProductCategory=async(req,res)=>{
    try {
        const id=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid ID format!"});
        }
        const category=await productCategoryModel.findOne({_id:id});
        if(!category){
            return res.status(404).json({message:"Category not found!"});
        }
       await productCategoryModel.findOneAndDelete({_id:id});
        return res.status(200).json({message:"Category deleted sucessfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
module.exports={addProductCategory,deleteProductCategory,getCategories};
