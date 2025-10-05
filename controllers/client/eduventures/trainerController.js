const trainerModel=require('../../../models/trainerModel');

const getTrainers=async(req,res)=>{
    try {
        const trainer=await trainerModel.find({});
        if(trainer.length===0){
            return res.json([])
        }
        return res.json(trainer);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }   
}
module.exports={getTrainers}