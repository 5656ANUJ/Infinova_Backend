const mongoose=require('mongoose');
const productCategorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
});
module.exports=mongoose.model('ProductCategory',productCategorySchema);