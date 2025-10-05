const mongoose=require('mongoose');
const hiringSolutionsModel=mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    details:{
        type:String,
        required:true
    },
    brochureUrl:{
        type:String,
        required:true
    },
    brochurePublicId:{
        type:String
    }
},{timestamps:true});
module.exports=mongoose.model('HiringSolution',hiringSolutionsModel);
