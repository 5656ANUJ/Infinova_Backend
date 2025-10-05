const mongoose=require('mongoose');
const serviceModel=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    brochureUrl:{
        type:String
    },
    brochurePublicId:{
        type:String

    },
    catgory:{
        type:mongoose.Types.ObjectId,
        ref:'ProductCategory',
        required:true
    }
},{timestamps:true});
module.exports=mongoose.model("Service",serviceModel);