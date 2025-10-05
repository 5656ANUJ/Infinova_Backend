const mongoose=require('mongoose');
const courseSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    details:{
        type:String,
        required:true
    },
    duration:{
        type:String,
    },
    brochureUrl:{
        type:String
    },
    brochurePublicId:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CourseCategory',
       
    },
    trainer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Trainer",
        required:true   
    },
    isPublished:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
module.exports=mongoose.model("Course",courseSchema);