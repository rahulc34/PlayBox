import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  sendOtp,
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

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/sendOtp").post(sendOtp);
// router.route("verify-Otp").post();
// router.route("/change-password").post(changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/verify-userEmail").post();
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(
    verifyJWT,
    uploadHandler(uploadImage.single("avatar")),
    updateUserAvatar
  );
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
