const mongoose=require('mongoose');
const serviceCategorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
});
module.exports=mongoose.model("ServiceCategory",serviceCategorySchema);