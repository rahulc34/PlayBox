import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { verifiedEmail } from "../middlewares/emailVerified.middleware.js";
const router = Router();
router.use(verifyJWT);
router.use(verifiedEmail); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers) // the users who subscibe to a channel
    .post(toggleSubscription);

    // the channel which user has subscibed
router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router
