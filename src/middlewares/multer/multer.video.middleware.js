import multer from "multer";
import path from "path";

//configuring the multer to sotore in disk location with specific name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the upload directory
    cb(null, "./public/videos");
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

// applying video filter of mp4,
const videoFilter = (req, file, cb) => {
  const allowedFileType = [
    "video/mp4",
    "video/mov",
    "video/avi",
    "video/3gpp",
    "video/mpg",
    "video/wmv",
  ];
  if (!allowedFileType.includes(file.mimetype)) {
    cb(
      "Please upload only file format of ( mp4, mov, 3gpp, mpg, wmv, avi )",
      false
    );
  } else cb(null, true);
};

// defining the multer intance for video file upload
// during the video upload
const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

export { uploadVideo };
