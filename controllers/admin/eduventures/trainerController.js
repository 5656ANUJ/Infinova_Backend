const trainerModel = require("../../../models/trainerModel");
const cloudinary = require("../../../configs/cloudinary");
const path = require("path");
const ALLOWED_IMAGE_EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const mongoose = require("mongoose");
const getTrainers = async (req, res) => {
  try {
    const trainers = await trainerModel.find();
    if (trainers.length === 0) {
      return res.json({ message: "No trainers found!" });
    }
    return res.json(trainers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const createTrainer = async (req, res) => {
  try {
    const imageFile = req.files.trainerImage;
    const ext = path.extname(imageFile.name).toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      return res
        .status(400)
        .json({
          message:
            "Unsupported image format. Only .jpg, .jpeg, .png, .webp allowed.",
        });
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({ message: "Image size exceeds 5MB." });
    }
    const result = await cloudinary.uploader.upload(imageFile.tempFilePath,{

      folder:"Trainer-images"});

    const { name, description, linkedIn, github, twitter } = req.body;
    const createdTrainer = await trainerModel.create({
      name,
      description,
      socialLinks: {
        linkedIn: linkedIn || "",
        github: github || "",
        twitter: twitter || "",
      },
      trainerImage: result.secure_url,
      trainerImagePublicId: result.public_id,
    });

    return res.status(200).json({message:"Trainer created sucessfully!",data:createdTrainer});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteTrainer = async (req, res) => {
  try {
    const id=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const trainer=await trainerModel.findById(id);
    if(!trainer){
      return res.status(404).json({message:"Trainer not found!"});
    }
    if(trainer.trainerImagePublicId){
      await cloudinary.uploader.destroy(trainer.trainerImagePublicId);
    }
    const deletedTrainer = await trainerModel.findByIdAndDelete(id);
    return res.json({ message: "Trainer deleted sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateTrainer = async (req, res) => {
  try {
    const { name, description, linkedIn, github, twitter } = req.body;
    const trainerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(trainerId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const trainer = await trainerModel.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found!" });
    }

    let updatedFields = {
      name: name || trainer.name,
      description: description || trainer.description,
      socialLinks: {
        linkedIn: linkedIn || trainer.socialLinks?.linkedIn || "",
        github: github || trainer.socialLinks?.github || "",
        twitter: twitter || trainer.socialLinks?.twitter || "",
      },
    };

    if (req.files?.trainerImage) {
      const imageFile = req.files.trainerImage;
      const ext = path.extname(imageFile.name).toLowerCase();

      if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
        return res.status(400).json({ message: "Unsupported image format." });
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return res.status(400).json({ message: "Image size exceeds 5MB." });
      }

      if (trainer.trainerImagePublicId) {
        await cloudinary.uploader.destroy(trainer.trainerImagePublicId);
      }

      const uploadResult = await cloudinary.uploader.upload(
        imageFile.tempFilePath,{
          folder:"Trainer-images"
        }
      );
      updatedFields.trainerImage = uploadResult.secure_url;
      updatedFields.trainerImagePublicId = uploadResult.public_id;
    }

    const updatedTrainer = await trainerModel.findByIdAndUpdate(
      trainerId,
      updatedFields,
      { new: true }
    );
    return res.json({
      message: "Trainer updated successfully",
      data: updatedTrainer,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getTrainers, createTrainer, deleteTrainer, updateTrainer };
