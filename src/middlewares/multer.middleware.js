import multer from "multer";
import path from "path";

// Set up storage configuration
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

// Initialize multer with the storage configuration
const upload = multer({ storage });

export default upload;
