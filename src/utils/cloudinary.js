import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary with my credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("file is uploaded sucessfully on cloudinary : ", response.url);
    return response;
  } catch (err) {
    console.log("Error uploading file to Cloudinary: ", err);
    fs.unlinkSync(localFilePath); // Delete the local file if upload fails
    return null;
  }
};

export { uploadOnCloudinary };
