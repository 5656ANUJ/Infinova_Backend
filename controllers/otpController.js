const otpModel=require('../models/otpModel');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getOtp = async(req, res) => {
    try {
        const {name, email, phone, age} = req.body;
        if(!email) {
            return res.status(400).json({success: false, message: "Email is required"});
        }
        
        const otp = Math.floor(1000 + Math.random() * 9000);
        
        const existingRecord = await otpModel.findOne({email});
        if(!existingRecord) {
            await otpModel.create({name, email, otp});
        } else {
            await existingRecord.updateOne({otp, createdAt: new Date()});
        }
        
        // Send email using SendGrid
        const msg = {
            to: email,
            from: process.env.VERIFIED_SENDER_EMAIL, // Must be verified in SendGrid
            subject: 'Your OTP',
            text: `Hi ${name}, your OTP code is ${otp}. It will expire in 5 minutes.`,
            html: `<strong>Hi ${name}</strong>, your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.`,
        };
        
        await sgMail.send(msg);
        
        res.json({success: true, message: "OTP sent successfully!"});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({success: false, message: "Internal Server Error", error: error.message});
    }
}
const verifyOtp=async(req,res)=>{
    try {
        const{email,name,number,age,enteredOtp}=req.body;
       
        
        
        const record=await otpModel.findOne({email});
      
        
        if(!record){
            return res.json({success:false,message:"Otp not found or expired!"})
        }
        if(enteredOtp==record.otp){
           
              return res.json({success:true,message:"Otp verified successfully"});
        }else{
            return res.json({ success: false, message: "Invalid OTP" });
        }
      
    } catch (error) {
        return res.status(500).json({success:false,message:"server error"});
    }
}
module.exports={getOtp,verifyOtp};