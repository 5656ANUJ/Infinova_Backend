const mongoose = require("mongoose");
const newCourseModel = require("./models/newCoursesModel");
const dotenv=require('dotenv'); // Adjust path

dotenv.config();
// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Course data with Cloudinary URLs
// PASTE YOUR CLOUDINARY URLs HERE after running uploadToCloudinary.js
const coursesData = [
  {
    name: "Clinical Research",
    details: "Comprehensive course on clinical trial design, regulations, and management. Hands-on experience with real-world case studies.",
    duration: "6 months",
    courseImageUrl: "https://res.cloudinary.com/drldvdr5g/image/upload/v1759824107/course-images/agd75xktatd9dmyagrxj.png", // Paste from uploadToCloudinary.js output
    courseImagePublicId: "course-images/agd75xktatd9dmyagrxj",
    brochureUrl: "https://res.cloudinary.com/drldvdr5g/raw/upload/v1759819798/Course-brochures/Clinical_research.pdf", // Paste from uploadToCloudinary.js output
    brochurePublicId: "Course-brochures/Clinical_research.pdf",
    category: null, // Add your category ObjectId here if needed
    trainer: null, // Add your trainer ObjectId here if needed
    isPublished: true,
  },
  {
    name: "Excelerate",
    details: "Master advanced Excel skills including VBA, macros, and data analysis to boost your productivity and career.",
    duration: "8 months",
    courseImageUrl: "https://res.cloudinary.com/drldvdr5g/image/upload/v1759824107/course-images/agd75xktatd9dmyagrxj.png", // Paste from uploadToCloudinary.js output
    courseImagePublicId: "course-images/agd75xktatd9dmyagrxj",
    brochureUrl: "https://res.cloudinary.com/drldvdr5g/raw/upload/v1759819826/Course-brochures/Excelerate.pdf",
    brochurePublicId: "Course-brochures/Excelerate.pdf",
    category: null,
    trainer: null,
    isPublished: true,
  },
  {
    name: "Launchpad",
    details: "Accelerate your career with our Launchpad program, designed for aspiring tech professionals.",
    duration: "4 months",
    courseImageUrl: "https://res.cloudinary.com/drldvdr5g/image/upload/v1759824107/course-images/agd75xktatd9dmyagrxj.png", // Paste from uploadToCloudinary.js output
    courseImagePublicId: "course-images/agd75xktatd9dmyagrxj",
    brochureUrl: "https://res.cloudinary.com/drldvdr5g/raw/upload/v1759819832/Course-brochures/Launchpad.pdf",
    brochurePublicId: "Course-brochures/Launchpad.pdf",
    category: null,
    trainer: null,
    isPublished: true,
  },
];

// Seed database
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding process...\n");
    console.log("=".repeat(70));

    // Validate that URLs have been updated
    const hasPlaceholder = coursesData.some(
      course => 
        course.courseImageUrl.includes("PASTE") || 
        course.brochureUrl.includes("PASTE")
    );

    if (hasPlaceholder) {
      console.error("❌ ERROR: Please replace all PASTE_*_HERE placeholders with actual Cloudinary URLs!");
      console.log("\n💡 Steps:");
      console.log("   1. Run: node uploadToCloudinary.js");
      console.log("   2. Copy the URLs from the output");
      console.log("   3. Paste them in this file (seedDatabase.js)");
      console.log("   4. Run: node seedDatabase.js\n");
      process.exit(1);
    }

    const seededCourses = [];

    for (let i = 0; i < coursesData.length; i++) {
      const courseData = coursesData[i];
      console.log(`\n📚 [${i + 1}/${coursesData.length}] Creating: ${courseData.name}`);
      console.log("─".repeat(70));

      try {
        // Prepare course object
        const courseObject = {
          name: courseData.name,
          details: courseData.details,
          duration: courseData.duration,
          courseImageUrl: courseData.courseImageUrl,
          courseImagePublicId: courseData.courseImagePublicId,
          brochureUrl: courseData.brochureUrl,
          brochurePublicId: courseData.brochurePublicId,
          isPublished: courseData.isPublished,
        };

        // Add category and trainer if provided
        if (courseData.category) {
          courseObject.category = courseData.category;
        }
        if (courseData.trainer) {
          courseObject.trainer = courseData.trainer;
        }

        console.log(`   💾 Saving to database...`);
        // Create course in database
        const newCourse = await newCourseModel.create(courseObject);

        seededCourses.push(newCourse);
        console.log(`   ✅ Successfully created!`);
        console.log(`   📝 Database ID: ${newCourse._id}`);

      } catch (error) {
        console.error(`   ❌ Error creating ${courseData.name}:`, error.message);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log(`🎉 Seeding completed! ${seededCourses.length}/${coursesData.length} courses added to database.`);
    console.log("=".repeat(70));

    // Display seeded courses
    if (seededCourses.length > 0) {
      console.log("\n📋 SEEDED COURSES:\n");
      seededCourses.forEach((course, index) => {
        console.log(`${index + 1}. ${course.name}`);
        console.log(`   • ID: ${course._id}`);
        console.log(`   • Duration: ${course.duration}`);
        console.log(`   • Published: ${course.isPublished ? "Yes" : "No"}`);
        console.log(`   • Image: ${course.courseImageUrl}`);
        console.log(`   • Brochure: ${course.brochureUrl}`);
        console.log("");
      });
    }

    return seededCourses;

  } catch (error) {
    console.error("❌ Database seeding error:", error);
    throw error;
  }
};

// Main execution
const runSeeder = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log("\n✅ All done! Closing database connection...");
    await mongoose.connection.close();
    console.log("👋 Database seeding completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeder failed:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run the seeder
runSeeder();