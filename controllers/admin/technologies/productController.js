const productModel = require("../../../models/productModel");
const mongoose = require("mongoose");
const cloudinary = require("../../../configs/cloudinary");
const path = require("path");
const fs=require('fs');
const getProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({createdAt:-1});
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found!" });
    }
    return res.json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const addProducts = async (req, res) => {
  try {
    const { name, details, cost, category } = req.body;
    let brochureUrl = "";
    let brochurePublicId = "";
    if (!name || !details || !cost || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (req.files?.brochure) {
      const brochureFile = req.files.brochure;
      const allowed_extension = [".pdf", ".docx"];
      const ext = path.extname(brochureFile.name).toLowerCase();
      if (!allowed_extension.includes(ext)) {
        return res
          .status(400)
          .json({ message: "Unsupported brochure file format" });
      }
      const result = await cloudinary.uploader.upload(
        brochureFile.tempFilePath,
        {
            folder:"Product-brochures",
            resource_type:"raw"
        }
      );
      brochureUrl = result.secure_url;
      brochurePublicId = result.public_id;
      fs.unlinkSync(brochureFile.tempFilePath);
    }
    const newProduct = await productModel.create({
      name: name.trim(),
      details: details.trim(),
      cost,
      brochureUrl,
      brochurePublicId,
      category,
    });
    return res
      .status(201)
      .json({ message: "Product added sucessfully!", data: newProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    const { name, details, cost, category } = req.body;
    const updatedFields = {
      name: name || product.name,
      details: details || product.details,
      cost: cost || product.cost,
      category: category || product.category,
    };
    if (req.files?.brochure) {
      const brochureFile = req.files.brochure;
      const allowed_extensions = [".pdf", ".docx"];
      const ext = path.extname(brochureFile.name).toLowerCase();
      if (!allowed_extensions.includes(ext)) {
        return res
          .status(400)
          .json({ message: "Unsupported brochure file format!!" });
      }
      if (product.brochurePublicId) {
        await cloudinary.uploader.destroy(product.brochurePublicId, {
          resource_type: "raw",
        });
      }
      const result = await cloudinary.uploader.upload(
        brochureFile.tempFilePath,
        {
            folder:"Product-brochures",
          resource_type: "raw",
        }
      );
      updatedFields.brochureUrl = result.secure_url;
      updatedFields.brochurePublicId = result.public_id;
      fs.unlinkSync(brochureFile.tempFilePath);
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteProduct=async(req,res)=>{
    try {
        const id=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid ID format!"});
        }
        const product=await productModel.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found!"});
        }
        if(product.brochurePublicId){
            await cloudinary.uploader.destroy(product.brochurePublicId,{
                resource_type:"raw"
            });

        }
        await productModel.findByIdAndDelete(id);
        return res.json({message:"Product deleted sucessfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
module.exports={getProducts,deleteProduct,updateProduct,addProducts};