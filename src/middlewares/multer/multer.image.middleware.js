import multer from "multer";
import path from "path";

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

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export { uploadImage };
