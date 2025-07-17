import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { pipeline } from "stream";

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

  const countLike = await Like.countDocuments({
    video: new mongoose.Types.ObjectId(videoId),
  });
  const like = await Like.findOne({ video: videoId, likedBy: userId });
  if (!like) {
    const createdLike = await Like.create({ video: videoId, likedBy: userId });
    video.likes = (video.likes || 0) + 1;
    await video.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { like: countLike + 1 },
          `video is Liked successfully`
        )
      );
  }

  const dislike = await Like.deleteOne({ video: videoId, likedBy: userId });
  video.likes = video.likes ? video.likes - 1 : 0;
  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { like: countLike >= 0 ? countLike - 1 : 0 },
        `video is dislike successfully`
      )
    );
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

  const countLike = await Like.countDocuments({
    comment: { $existed: true },
    comment: new mongoose.Types.ObjectId(commentId),
  });

  const like = await Like.findOne({ comment: commentId, likedBy: userId });
  if (!like) {
    const createdLike = await Like.create({
      comment: commentId,
      likedBy: userId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { likes: countLike + 1 },
          `comment is Liked successfully`
        )
      );
  }

  const dislike = await Like.deleteOne({ comment: commentId, likedBy: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: countLike > 0 ? countLike - 1 : 0 },
        `comment is dislike successfully`
      )
    );
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

  const likeCount = await Like.countDocuments({ tweet: tweetId });
  const like = await Like.findOne({ tweet: tweetId, likedBy: userId });
  if (!like) {
    const createdLike = await Like.create({ tweet: tweetId, likedBy: userId });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { likes: likeCount + 1 },
          `tweet is Liked successfully`
        )
      );
  }

  const dislike = await Like.deleteOne({ tweet: tweetId, likedBy: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: likeCount ? likeCount - 1 : 0 },
        `tweet is dislike successfully`
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  //TODO: get all liked videos
  console.log(userId);
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
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerInfo",
            },
          },
          {
            $unwind: "$ownerInfo", // Unwind the ownerInfo array to get a single object
          },
          {
            $project: {
              _id: 1,
              thumbnail: 1,
              isPublished: 1,
              title: 1,
              description: 1,
              duration: 1,
              views: 1,
              createdAt: 1,
              owner: 1,
              "ownerInfo.username": 1, // Include specific user fields
              "ownerInfo.avatar": 1,
              "ownerInfo.fullname": 1, // Include specific user fields
            },
          },
        ],
      },
    },
    {
      $unwind: "$videoList",
    },
  ]);

  console.log(likes);

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "liked video is fetched successfully"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
