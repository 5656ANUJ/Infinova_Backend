const express=require('express');
const app=express();
const fileUpload=require('express-fileupload');
app.use(express.json());
const intershipRouter=require('./routes/admin/eduventures/intershipRoutes')
const jobRouter=require("./routes/admin/eduventures/jobRouter");
const courseCategoryRouter=require('./routes/admin/eduventures/courseCategoryRoutes')
const trainerRouter=require('./routes/admin/eduventures/trainerRoute');
const courseRouter=require('./routes/admin/eduventures/courseRoutes');
const testimonialRouter=require('./routes/admin/eduventures/testimonialRoutes');
const trainingCategoryRouter=require('./routes/admin/consultants/trainingCategoryRoutes');
const trainingRouter=require('./routes/admin/consultants/trainingRoutes');
const hiringSolutionsCategoryRouter=require('./routes/admin/consultants/hiringSolutionsCategoryRoutes')
const hiringSolutionsRouter=require('./routes/admin/consultants/hiringSolutionsRoutes');
const serviceCategoryRouter=require('./routes/admin/technologies/serviceCategoryRoutes')
const productCategoryRouter=require('./routes/admin/technologies/productCategoryRoutes');
const newCourseRouter=require('./routes/admin/eduventures/newCoursesRoutes')
const clientCourseRouter=require('./routes/client/eduventures/courseRouter');
const clientTrainerRouter=require('./routes/client/eduventures/trainerRoutes');
const clientInternshipRouter=require('./routes/client/eduventures/internshipRoutes');
const clientJobRouter=require('./routes/client/eduventures/jobRoutes')
const otpRouter=require('./routes/otpRoutes');
const brochureDownloadRouter=require("./routes/brochureDownloadRoutes");
const clientNewCourseRouter=require('./routes/client/eduventures/newCourseRouter')
const contactFormRouter=require('./routes/contactRoutes');
const cors=require('cors')
app.use(cors());
app.use(fileUpload({
    useTempFiles:true
}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/admin/internships",intershipRouter);
app.use('/api/admin/jobs',jobRouter);
app.use('/api/admin/course-category',courseCategoryRouter);
app.use('/api/admin/trainers',trainerRouter);
app.use('/api/admin/courses',courseRouter);
app.use('/api/admin/testimonials',testimonialRouter);
app.use('/api/admin/training-category',trainingCategoryRouter);
app.use('/api/admin/trainings',trainingRouter);
app.use('/api/admin/hiringSolutions-category',hiringSolutionsCategoryRouter);
app.use('/api/admin/newCourse',newCourseRouter)
app.use('/api/admin/hiringSolutions',hiringSolutionsRouter);
app.use('/api/admin/service-category',serviceCategoryRouter); 
app.use('/api/admin/product-category',productCategoryRouter);
app.use('/api/user/courses',clientCourseRouter);
app.use('/api/user/trainers',clientTrainerRouter);
app.use('/api/user/internships',clientInternshipRouter);
app.use('/api/user/jobs',clientJobRouter);
app.use('/api/user/new-course',clientNewCourseRouter);
app.use('/api/otp',otpRouter);
app.use('/api/brochure_downloads',brochureDownloadRouter);
app.use('/api/contact_form',contactFormRouter);
app.get('/',(req,res)=>{
    res.send("API started!!");
});
module.exports=app;