const mongoose=require('mongoose');
const trainerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    socialLinks:{
        linkedIn:String,
        github:String,
        twitter:String
    },
    trainerImage:{
        type:String
    },
    trainerImagePublicId:{
        type:String
    }
},{timestamps:true});
module.exports=mongoose.model("Trainer",trainerSchema);
  




