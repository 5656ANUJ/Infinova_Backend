const jobModel=require('../../../models/jobModel');
const getJobs=async(req,res)=>{
    try {
        const jobs=await jobModel.find({});
        if(jobs.length===0){
            return res.json([]);
        }
        return res.json(jobs)
    } catch (error) {
        return res.json(error)
    }
}
module.exports={getJobs};