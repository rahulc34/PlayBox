import multer from "multer";
import path from "path";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import fs from "fs";

//configuring the multer to sotore in disk location with specific name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the upload directory
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    // Define the file naming convention
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// applying image filter of png, jpg and jpeg type
const imageFilter = (req, file, cb) => {
  const allowedFileType = ["image/png", "image/jpg", "image/jpeg"];

  if (!allowedFileType.includes(file.mimetype)) {
    cb("Please upload only .png, .jpg or .jpeg file type", false);
  } else cb(null, true);
};

//defining the middleware with error handling
const upload = (uploadFile) =>
  asyncHandler((req, res, next) => {
    return uploadFile(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE")
          return res.status(400).json({ code: err.code, error: err.message });
        // handle unexpected file error
        if (err.code === "LIMIT_UNEXPECTED_FILE")
          return res.status(400).json({ code: err.code, error: err.message });
        // handle unexpected field key error
        if (err.code === "LIMIT_FIELD_KEY")
          return res.status(400).json({ code: err.code, error: err.message });
      } else if (err) {
        return res.status(400).json(err);
      }
      console.log("multer middleware ---> ", req.file);
      next();
    });
  });

// defining the multer intance with file size of max 5mb for both avatar and coverimage
const uploadAvatarAndCoverImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

// defining the multer intance for avatar file upload only
const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("avatar");

// defining the multer intance for coverImage file upload only
const uploadCoverImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("coverImage");

export { uploadAvatarAndCoverImage, uploadAvatar, uploadCoverImage, upload };
