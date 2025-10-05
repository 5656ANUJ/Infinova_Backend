const brochureDownloadModel=require('../models/brochureDownloadModel');
const {parse}=require('json2csv');
const fs=require('fs');
const path=require('path');

const downloadBrochure=async(req,res)=>{
    try {
        const{email,name,phone,course}=req.body;
        const newEntry=await brochureDownloadModel.create({email,name,phone,course});
        const allData=await brochureDownloadModel.find({}).lean();
        const csv=parse(allData,{fields:["name","email","phone","course","timestamp"]});
        const filePath=path.join(process.cwd(),'brochure_downloads.csv');
        fs.writeFileSync(filePath,csv);
        return res.json({sucess:true,message:"brochure download recorded and file updated!!"})

    } catch (error) {
        return res.status(500).json({message:"server error ",error:error.message})
    }
}
module.exports={downloadBrochure};