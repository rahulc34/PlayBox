import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  increaseLikeAndSaveToHistory,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo } from "../middlewares/multer/multer.video.middleware.js";
import { uploadImage } from "../middlewares/multer/multer.image.middleware.js";
import { uploadHandler } from "../middlewares/multer/multer.uploadHandler.js";
import { verifiedEmail } from "../middlewares/emailVerified.middleware.js";
const router = Router();
router.use(verifyJWT);
router.use(verifiedEmail); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllVideos)
  .post(
    uploadHandler(
      uploadVideo.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
      ])
    ), // Handles the "thumbnail" and video field
    publishAVideo
  );

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(uploadHandler(uploadImage.single("thumbnail")), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/saveIncView/:videoId").patch(increaseLikeAndSaveToHistory);

export default router;
