const cloudinary = require("./configs/cloudinary"); // Adjust path to your cloudinary config
const fs = require("fs");
const path = require("path");

// Upload file to Cloudinary
const uploadToCloudinary = async (filePath, folder, resourceType = "auto", customPublicId = null) => {
  try {
    const options = {
      folder,
      resource_type: resourceType,
    };

    if (resourceType === "raw") {
      options.format = "pdf";
    }

    if (customPublicId) {
      options.public_id = customPublicId;
    }

    const result = await cloudinary.uploader.upload(filePath, options);
    console.log(`   ✅ Uploaded: ${path.basename(filePath)}`);
    console.log(`   📎 URL: ${result.secure_url}`);
    console.log(`   🆔 Public ID: ${result.public_id}\n`);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(`   ❌ Upload error:`, error.message);
    throw error;
  }
};

// Files to upload
const filesToUpload = [
  // Images
  {
    type: "image",
    name: "course",
    fileName: "course.png",
    folder: "images",
    cloudinaryFolder: "course-images",
    resourceType: "image"
  },
  
  {
    type: "brochure",
    name: "Clinical research",
    fileName: "Clinical_Research.pdf",
    folder: "brochures",
    cloudinaryFolder: "Course-brochures",
    resourceType: "raw"
  },
  {
    type: "brochure",
    name: "Excelerate",
    fileName: "Excelerate.pdf",
    folder: "brochures",
    cloudinaryFolder: "Course-brochures",
    resourceType: "raw"
  },
  {
    type: "brochure",
    name: "Launchpad",
    fileName: "Launchpad.pdf",
    folder: "brochures",
    cloudinaryFolder: "Course-brochures",
    resourceType: "raw"
  },
];

// Main upload function
const uploadFiles = async () => {
  console.log("🚀 Starting Cloudinary Upload Process...\n");
  console.log("=".repeat(70));

  const publicFolder = path.join(__dirname, "public"); // Adjust if needed
  const uploadedFiles = [];

  for (let i = 0; i < filesToUpload.length; i++) {
    const file = filesToUpload[i];
    console.log(`\n📤 [${i + 1}/${filesToUpload.length}] Uploading ${file.type.toUpperCase()}: ${file.name}`);
    console.log("─".repeat(70));

    try {
      const filePath = path.join(publicFolder, file.fileName);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  File not found: ${filePath}`);
        console.log(`   ⏭️  Skipping...\n`);
        continue;
      }

      // Create custom public ID for PDFs
      let customPublicId = null;
      if (file.resourceType === "raw") {
        customPublicId = file.name.replace(/\s+/g, "_");
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(
        filePath,
        file.cloudinaryFolder,
        file.resourceType,
        customPublicId
      );

      uploadedFiles.push({
        name: file.name,
        type: file.type,
        fileName: file.fileName,
        url: result.url,
        publicId: result.publicId,
      });

    } catch (error) {
      console.error(`   ❌ Error uploading ${file.fileName}:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log(`🎉 Upload completed! ${uploadedFiles.length}/${filesToUpload.length} files uploaded successfully.`);
  console.log("=".repeat(70));

  // Display results grouped by course
  console.log("\n📋 UPLOADED FILES SUMMARY:\n");
  console.log("Copy these URLs to use in seedDatabase.js file\n");
  console.log("=".repeat(70));

  const courseNames = [...new Set(uploadedFiles.map(f => f.name))];
  
  courseNames.forEach((courseName, index) => {
    console.log(`\n${index + 1}. ${courseName}`);
    console.log("─".repeat(70));
    
    const courseFiles = uploadedFiles.filter(f => f.name === courseName);
    
    courseFiles.forEach(file => {
      console.log(`\n   ${file.type.toUpperCase()}:`);
      console.log(`   URL: ${file.url}`);
      console.log(`   Public ID: ${file.publicId}`);
    });
  });

  console.log("\n" + "=".repeat(70));
  console.log("\n💡 Next Step: Copy the URLs above and paste them into seedDatabase.js");
  console.log("   Then run: node seedDatabase.js\n");
};

// Run the upload
uploadFiles()
  .then(() => {
    console.log("✅ Upload script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Upload failed:", error);
    process.exit(1);
  });