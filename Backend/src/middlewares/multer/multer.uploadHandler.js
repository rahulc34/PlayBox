import { asyncHandler } from "../../utils/asyncHandler.js";
import multer from "multer";

//defining the middleware with error handling
const uploadHandler = (uploadFile) =>
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
      next();
    });
  });

export { uploadHandler };
