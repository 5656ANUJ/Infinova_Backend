const mongoose=require('mongoose');
const testimonialSchema=mongoose.Schema({
    name:{
        type:String
    },
    message:{
        type:String
    },
    videoUrl:{
        type:String
    },
    videoPublicId:{
        type:String
    },
    imageUrl:{
        type:String
    },
    imagePublicId:{
        type:String
    },
    website:{
        type:String
    },

},{timstamps:true});
module.exports=mongoose.model("Testimonial",testimonialSchema);