import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { uploadHandler } from "../middlewares/multer/multer.uploadHandler.js";
import { uploadImage } from "../middlewares/multer/multer.image.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.route("/register").post(
  uploadHandler(
    uploadImage.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ])
  ),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, uploadHandler(uploadImage.single("avatar")), updateUserAvatar);
router
  .route("/coverImage")
  .patch(
    verifyJWT,
    uploadHandler(uploadImage.single("coverImage")),
    updateUserCoverImage
  );
router.route("/C/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
