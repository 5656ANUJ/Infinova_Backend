const internShipModel=require('../../../models/intershipModel');
const getInternships=async(req,res)=>{
    try {
        const internships=await internShipModel.find({});
        if(internships.length===0){
            return res.json([]);

        }
        return res.json(internships);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
module.exports={getInternships};