const courseModel = require("../../../models/courseModel");

const getCourses = async (req, res) => {
  try {
    const populatedCourse = await courseModel
      .find({})
      .populate("trainer")
      .populate("category");
      if(populatedCourse.length===0){
        return res.json([])
      }
      return res.json(populatedCourse);
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
};
module.exports={getCourses}