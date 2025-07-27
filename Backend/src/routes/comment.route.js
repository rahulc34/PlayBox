import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
  addReplyToComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { verifiedEmail } from "../middlewares/emailVerified.middleware.js";
const router = Router();
router.use(verifyJWT);
router.use(verifiedEmail); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/:videoId/:commentId").post(addReplyToComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
