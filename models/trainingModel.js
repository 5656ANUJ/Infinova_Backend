const mongoose=require('mongoose');
const trainingSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    brochureUrl:{
        type:String
    },
    brochurePublicId:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'TrainingCategory',
        required:true
    },
    trainer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Trainer',
        required:true

    }

},{timestamps:true});
module.exports=mongoose.model('Training',trainingSchema);