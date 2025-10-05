const nodemailer=require('nodemailer')
const sendEmail=async(req,res)=>{
    try {
        const{name,email,subject,message}=req.body;
        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:`${process.env.AUTH_USER}`,
                pass:`${process.env.AUTH_PASS}`
            }
        });
        await transporter.sendMail({
            from:`${email}`,
            to:`${process.env.AUTH_USER}`,
            subject:"You have a new contact form submission",
            text:`
                name:${name}
                email:${email}
                subject:${subject}
                message:${message}

            `

        })
        return res.status(200).json({success:true,message:"Email sent successfully!!"})
    } catch (error) {
        return res.status(500).json({success:true,message:"Failed to send email"})
    }
}
module.exports={sendEmail};