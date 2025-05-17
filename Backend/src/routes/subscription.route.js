import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers) // the users who subscibe to a channel
    .post(toggleSubscription);

    // the channel which user has subscibed
router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODA3M2Q2NzQ2MzI0NTRhM2IwN2NhNTgiLCJ1c2VybmFtZSI6ImJlcnNlcmsiLCJmdWxsbmFtZSI6ImJlcnNlcmsgY2hhbm5lbCIsImVtYWlsIjoiYmVyc2VyazUwMEBnbWFpbC5jb20iLCJpYXQiOjE3NDcwMjM2MDEsImV4cCI6MTc0NzExMDAwMX0.JE62luZ3sU92p6x_o8IxVsGrr5EJGBU8WOmdLaODnh0
// 68073d674632454a3b07ca58
// berserk

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODA3M2RjZjQ2MzI0NTRhM2IwN2NhNWMiLCJ1c2VybmFtZSI6IndlYmRldiIsImZ1bGxuYW1lIjoid2ViZGV2IGNoYW5uZWwiLCJlbWFpbCI6IndlYmRldjUwMEBnbWFpbC5jb20iLCJpYXQiOjE3NDcwMjM4MTQsImV4cCI6MTc0NzExMDIxNH0.koqs5b0TJl5ifrUjto2z_K2L2KXe2PKuGu91OSxQqOA
// 68073dcf4632454a3b07ca5c
// webdev

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODA3M2Y3MDk3ZTY1ZjM2N2Q3MjNiMmUiLCJ1c2VybmFtZSI6ImNhcnRvb24iLCJmdWxsbmFtZSI6ImNhcnRvb24gY2hhbm5lbCIsImVtYWlsIjoiY2FydG9vbjUwMEBnbWFpbC5jb20iLCJpYXQiOjE3NDcwMjM4NjgsImV4cCI6MTc0NzExMDI2OH0._KNOlx6iJYUcUsKirqv-2xVIHTaxLtRoJSppQn9dnZ8
// 68073f7097e65f367d723b2e
// cartooon