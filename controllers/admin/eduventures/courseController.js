const mongoose = require("mongoose");
const courseModel = require("../../../models/courseModel");
const cloudinary = require("../../../configs/cloudinary");
const fs = require("fs");
const path = require("path");
const getCourses = async (req, res) => {
  try {
    const populatedCourse = await courseModel
      .find()
      .populate("trainer")
      .populate("category");
    if (populatedCourse.length === 0) {
      return res.status(404).json({ message: "No courses found!" });
    }
    res.json(populatedCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const addCourse = async (req, res) => {
  try {
     const { name, details, duration, category, trainer } = req.body;
     // taking the name to create a custom pdf by setting the public id as fileName also removing the whitespaces using regular expressions
     const courseName=name;
     const publicId=courseName.replace(/\s+/g,"_");
    const brochureFile = req.files.brochure;
   
    
    const allowedExtensions = [".pdf", ".docx"];
    const ext = path.extname(brochureFile.name).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ message: "Unsupported brochure format." });
    }
    const result = await cloudinary.uploader.upload(brochureFile.tempFilePath, {
      folder: "Course-brochures",
      resource_type: "auto",
      format:'pdf',
      public_id:publicId
    });
   
    const brochureUrl = result.secure_url;
    const brochurePublicId = result.public_id;
    
    
    const newCourse = await courseModel.create({
      name,
      details,
      duration,
      brochureUrl,
      brochurePublicId,
      category,
      trainer,
      isPublished: true,
    });

    const populatedCourse = await courseModel
      .findById(newCourse._id)
      .populate("trainer")
      .populate("category");
    fs.unlink(brochureFile.tempFilePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });
    return res.json(populatedCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format!" });
    }
    const courseId = req.params.id;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    if (course.brochurePublicId) {
      await cloudinary.uploader.destroy(course.brochurePublicId, {
        resource_type: "raw",
      });
    }
    const deletedCourse = await courseModel.findOneAndDelete({
      _id: req.params.id,
    });

    return res.json({ message: "deleted course sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid ID format!" });
    }
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }
    const {
      name,
      details,
      duration,
      category,
      trainer,
      isPublished,
    } = req.body;
    const updatedFields = {
      name: name || course.name,
      details: details || course.details,
      duration: duration || course.duration,
      category: category || course.category,
      trainer: trainer || course.trainer,
      isPublished: isPublished || course.isPublished,
    };
    if (req.files?.brochure) {
      const brochureFile = req.files.brochure;
      const allowedExtensions = [".pdf", ".docx"];
      const ext = path.extname(brochureFile.name).toLowerCase();

      if (!allowedExtensions.includes(ext)) {
        return res
          .status(400)
          .json({ message: "Unsupported brochure format." });
      }
      if (course.brochurePublicId) {
        await cloudinary.uploader.destroy(course.brochurePublicId, {
          resource_type: "raw",
        });
      }
      const result = await cloudinary.uploader.upload(
        brochureFile.tempFilePath,
        {
          folder: "Course-brochures",
          resource_type: "raw",
        }
      );
      updatedFields.brochureUrl = result.secure_url;
      updatedFields.brochurePublicId = result.public_id;
      fs.unlink(brochureFile.tempFilePath, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }

    const updatedCourse = await courseModel.findOneAndUpdate(
      { _id: req.params.id },
      updatedFields,
      { new: true }
    );
    const populatedCourse = await courseModel
      .findById(updatedCourse._id)
      .populate("trainer")
      .populate("category");
    return res
      .status(200)
      .json({ message: "Updated course sucessfully!", data: populatedCourse });
  } catch (error) {
    return res.status(500).json({ meessage: error.message });
  }
};
module.exports = { getCourses, addCourse, deleteCourse, updateCourse };
