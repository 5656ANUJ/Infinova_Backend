const internshipModel = require("../../../models/intershipModel");
const mongoose=require('mongoose');
const createIntership = async (req, res) => {
  try {
    const internship = await internshipModel.create(req.body);
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getInternship = async (req, res) => {
  try {
    const data = await internshipModel.find();

    if (data.length === 0) {
      return res.json({ message: "No internships found!" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateInternship = async (req, res) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).json({message:"Invalid ID format"});
    }
    const updated = await internshipModel.findOneAndUpdate(
      {_id:req.params.id},
      req.body,
      { new: true }
    );
    if(!updated){
      return res.status(404).json({message:"Internship not found!"});
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteInternship = async (req, res) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).json({message:"Invalid ID format"});
    }
    const deletedInternship = await internshipModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedInternship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    res.json({ message: "Internship deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createIntership,
  getInternship,
  updateInternship,
  deleteInternship,
};
