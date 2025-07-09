import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  forgetPassword,
  resetPassword,
  sendEmailVerify,
  verifyEmail,
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
import { verifiedEmail } from "../middlewares/emailVerified.middleware.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:id/:token").post(resetPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/sendEmail-verify").post(verifyJWT, sendEmailVerify);
router.route("/verify-Email/:id/:token").post(verifyJWT, verifyEmail);
router
  .route("/update-account")
  .patch(verifyJWT, verifiedEmail, updateAccountDetails);
router
  .route("/avatar")
  .patch(
    verifyJWT,
    verifiedEmail,
    uploadHandler(uploadImage.single("avatar")),
    updateUserAvatar
  );
router
  .route("/coverImage")
  .patch(
    verifyJWT,
    verifiedEmail,
    uploadHandler(uploadImage.single("coverImage")),
    updateUserCoverImage
  );
router
  .route("/C/:username")
  .get(verifyJWT, verifiedEmail, getUserChannelProfile);
router.route("/history").get(verifyJWT, verifiedEmail, getWatchHistory);

export default router;
