const path=require('path');
const nodemailer=require('nodemailer');
const cron =require('node-cron');
const filePath='C:/Users/ikapa/OneDrive/Desktop/InfinovaCompanyWebsite/server/brochure_downloads.csv'
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"ikapadwanchwala@gmail.com",
        pass:"kjulpyzbqqcplsie"
    }
});
cron.schedule("0 1 * * * ",async()=>{
    try {
        await transporter.sendMail({
            from:"ikapadwanchwala@gmail.com",
            to:"kapadwanchwalai@gmail.com",
            subject:"Daily brochure downloads report",
            text:"Attached is the daily CSV report of brochure downloads.",
            attachments:[
                {
                    filename:"brochure_downloads.csv",
                    path:filePath
                }
            ]
        });
        console.log("Email sent at 1:00 am");
        
    } catch (error) {
        console.log("Error sending the file",error);
        
    }
},{timezone:"Asia/Kolkata"});




