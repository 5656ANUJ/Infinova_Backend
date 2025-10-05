const courseCategoryModel = require("../../../models/courseCategoryModel");
const mongoose=require('mongoose') ;
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    const exists = await courseCategoryModel.findOne({ name });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Course category already exists!!" });
    }
    const courseCategory = await courseCategoryModel.create(req.body);
    return res.status(201).json(courseCategory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getCategories = async (req, res) => {
  try {
    const categories = await courseCategoryModel.find();
    if (categories.length === 0) {
      return res.json({ message: "No categories found" });
    }
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateCategory = async (req, res) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({message:"Invalid ID format"});
    }
    const updatedCategory = await courseCategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
   
    
    if(!updatedCategory){
        return res.status(404).json({message:"Category not found!"});
    }
    return res.json({ message: "Category updated sucessfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteCategories = async (req, res) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
          return res.status(400).json({message:"Invalid ID format"});
        }
    const deletedCategory = await courseCategoryModel.findOneAndDelete(
      req.params.id
    );
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json({ message: "Category deleted sucessfully!!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  deleteCategories,
  getCategories,
  addCategory,
  updateCategory,
};
