import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id?.toString();
  //TODO: toggle like on video

  if (!isValidObjectId(videoId)) {
    throw new ApiError("Invalid videoId");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video does not exist");
  }

  const like = await Like.findOne({ video: videoId, likedBy: userId });
  if (!like) {
    const createdLike = await Like.create({ video: videoId, likedBy: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, null, `video is Liked successfully`));
  }

  const dislike = await Like.deleteOne({ video: videoId, likedBy: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, `video is dislike successfully`));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id?.toString();

  if (!isValidObjectId(commentId)) {
    throw new ApiError("Invalid commentId");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "comment does not exist");
  }

  const like = await Like.findOne({ comment: commentId, likedBy: userId });
  if (!like) {
    const createdLike = await Like.create({
      comment: commentId,
      likedBy: userId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, null, `comment is Liked successfully`));
  }

  const dislike = await Like.deleteOne({ comment: commentId, likedBy: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, `comment is dislike successfully`));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id?.toString();

  if (!isValidObjectId(tweetId)) {
    throw new ApiError("Invalid tweetId");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "tweet does not exist");
  }

  const like = await Like.findOne({ tweet: tweetId, likedBy: userId });
  if (!like) {
    const createdLike = await Like.create({ tweet: tweetId, likedBy: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, null, `tweet is Liked successfully`));
  }

  const dislike = await Like.deleteOne({ tweet: tweetId, likedBy: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, `tweet is dislike successfully`));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  //TODO: get all liked videos

  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid userId");
  }

  const likes = await Like.aggregate([
    {
      $match: { likedBy: userId, video: { $exists: true, $ne: null } },
    },
    {
      $lookup: {
        as: "videoList",
        from: "videos",
        localField: "video",
        foreignField: "_id",
      },
    },
    {
      $unwind: "$videoList",
    },
    {
      $replaceRoot: { newRoot: "$videoDetails" },
    },
  ]);

  return res
    .status(200)
    .json(200, likes, "liked video is fetched successfully");
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
