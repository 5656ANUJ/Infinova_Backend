const testimonialModel = require("../../../models/testimonialModel");
const cloudinary = require("../../../configs/cloudinary");
const path = require("path");
const mongoose = require("mongoose");
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp"];
const ALLOWED_VIDEO_TYPES = [".mp4", ".mov", ".avi"];
const addTestimonial = async (req, res) => {
  try {
    const { name, message, website } = req.body;

    let videoUrl = "";
    let imageUrl = "";
    let videoPublicId="";
    let imagePublicId="";
    if (req.files?.videoUrl) {
      const videoFile = req.files.videoUrl;
      const ext = path.extname(videoFile.name).toLowerCase();
      if (!ALLOWED_VIDEO_TYPES.includes(ext)) {
        return res.status(400).json({ message: "Unsupported video format." });
      }

      const videoResult = await cloudinary.uploader.upload(
        videoFile.tempFilePath,
        {
          resource_type: "video",
          folder: "Testimonial-video",
        }
      );
      videoUrl = videoResult.secure_url;
      videoPublicId = videoResult.public_id;
    }

    if (req.files?.imageUrl) {
      const imageFile = req.files.imageUrl;
      const ext = path.extname(imageFile.name).toLowerCase();
      if (!ALLOWED_IMAGE_TYPES.includes(ext)) {
        return res.status(400).json({ message: "Unsupported image format." });
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return res.status(400).json({ message: "Image size exceeds 5MB." });
      }

      const imageResult = await cloudinary.uploader.upload(
        imageFile.tempFilePath,
        { folder: "Testimonial-image" }
      );
      imageUrl = imageResult.secure_url;
      imagePublicId = imageResult.public_id;
    }
    const newTestimonial = await testimonialModel.create({
      name,
      message,
      videoUrl,
      videoPublicId,
      imageUrl,
      imagePublicId,
      website,
    });
    return res.json({
      message: "Testimonial added sucessfully!",
      data: newTestimonial,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel.find({});
    if (testimonials.length === 0) {
      return res.json({ message: "No testimonials found!" });
    }
    return res.json({ data: testimonials });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteTestimonials = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id format!" });
    }
    const testimonial = await testimonialModel.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found!" });
    }
    if (testimonial.imagePublicId) {
      await cloudinary.uploader.destroy(testimonial.imagePublicId);
    }
    if (testimonial.videoPublicId) {
      await cloudinary.uploader.destroy(testimonial.videoPublicId);
    }
    await testimonialModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Tetstimonial deleted sucessfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateTestimonial = async (req, res) => {
  try {
    const { name, message, website } = req.body;
    const testimonialId = req.params.id;
    const testimonial = await testimonialModel.findById(testimonialId);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found!!" });
    }
    let imageUrl = testimonial.imageUrl;
    let videoUrl = testimonial.videoUrl;
    let imagePublicId = testimonial.imagePublicId;
    let videoPublicId = testimonial.videoPublicId;
    if (req.files?.imageUrl) {
      const imageFile = req.files.imageUrl;
      const ext = path.extname(imageFile.name).toLowerCase();
      if (!ALLOWED_IMAGE_TYPES.includes(ext)) {
        return res.status(400).json({ message: "Unsupported image format." });
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return res.status(400).json({ message: "Image size exceeds 5MB." });
      }
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId);
      }
      const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "Testimonial-image",
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }
    if (req.files?.videoUrl) {
      const videoFile = req.files.videoUrl;
      const ext = path.extname(videoFile.name).toLowerCase();
      if (!ALLOWED_VIDEO_TYPES.includes(ext)) {
        return res.status(400).json({ message: "Unsupported video format." });
      }
      if (videoPublicId) {
        await cloudinary.uploader.destroy(videoPublicId, {
          resource_type: "video",
        });
      }
      const result = await cloudinary.uploader.upload(videoFile.tempFilePath, {
        resource_type: "video",
        folder: "Testimonial-video",
      });
      videoUrl = result.secure_url;
      videoPublicId = result.public_id;
    }
    const updatedTestimonial = await testimonialModel.findByIdAndUpdate(
      testimonialId,
      {
        name,
        message,
        website,
        imageUrl,
        videoUrl,
        imagePublicId,
        videoPublicId,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({
        message: "Testimonial updated sucessfully!",
        data: updatedTestimonial,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  addTestimonial,
  getTestimonials,
  deleteTestimonials,
  updateTestimonial,
};
