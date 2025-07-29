import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { ApiError } from "./apiError.js";
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

    // console.log("file is uploaded sucessfully on cloudinary : ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (err) {
    // console.log("Error uploading file to Cloudinary: ", err);
    fs.unlinkSync(localFilePath); // Delete the local file if upload fails
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resouceType) => {
  try {
    // console.log("Deleting from Cloudinary: ", publicId);
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resouceType,
      invalidate: true,
    });

    if (response?.result === "not found") {
      // console.log("File not found on Cloudinary: ", publicId);
      return "not found";
    }

    if (response?.result === "ok") {
      // console.log("File successfully deleted from Cloudinary: ", publicId);
      return "deleted";
    }

    // console.log("Unexpected response from Cloudinary: ", response);
    return "error";
  } catch (error) {
    // console.error("Error while deleting the file from Cloudinary: ", error);
    throw new ApiError(500, "Failed to delete file from Cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
