const mongoose=require('mongoose');
const brochureDownloadSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now()
    }
});
module.exports=mongoose.model("brochureDownload",brochureDownloadSchema);