import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router

// berserk
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODA3M2Q2NzQ2MzI0NTRhM2IwN2NhNTgiLCJ1c2VybmFtZSI6ImJlcnNlcmsiLCJmdWxsbmFtZSI6ImJlcnNlcmsgY2hhbm5lbCIsImVtYWlsIjoiYmVyc2VyazUwMEBnbWFpbC5jb20iLCJpYXQiOjE3NDcyNDUyNjgsImV4cCI6MTc0NzMzMTY2OH0.aMcjuQ_fgbtQNFQjYnhRgE9_bUa-UWe6hJSYSJN1dyI
// 68073d674632454a3b07ca58
//tweet

// webdev
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODA3M2RjZjQ2MzI0NTRhM2IwN2NhNWMiLCJ1c2VybmFtZSI6IndlYmRldiIsImZ1bGxuYW1lIjoid2ViZGV2IGNoYW5uZWwiLCJlbWFpbCI6IndlYmRldjUwMEBnbWFpbC5jb20iLCJpYXQiOjE3NDcyNDUzMzUsImV4cCI6MTc0NzMzMTczNX0.4HfXiXvu6tPNM5rvIUCF2I5WRCEre4AdIlTbOZCyMUc
// 68073dcf4632454a3b07ca5c
//tweet

// cartoon
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODA3M2Y3MDk3ZTY1ZjM2N2Q3MjNiMmUiLCJ1c2VybmFtZSI6ImNhcnRvb24iLCJmdWxsbmFtZSI6ImNhcnRvb24gY2hhbm5lbCIsImVtYWlsIjoiY2FydG9vbjUwMEBnbWFpbC5jb20iLCJpYXQiOjE3NDcyNDU0MzQsImV4cCI6MTc0NzMzMTgzNH0.nOSxnfduYXp-SzsGp7fxOqfiyA-1nk40ihaU90hhGws
// 68073f7097e65f367d723b2e
//tweet