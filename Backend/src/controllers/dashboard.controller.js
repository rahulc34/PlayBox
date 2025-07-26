import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user?._id?.toString();
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid Object Id");
  }

  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  // const latestVideos = await Video.aggregate([
  //   { $match: { owner: new mongoose.Types.ObjectId(userId) } },
  //   { $sort: { createdAt: 1 } },
  //   { $limit: 5 },
  //   {
  //     $lookup: {
  //       as: "like",
  //       from: "likes",
  //       localField: "_id",
  //       foreignField: "video",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       as: "comment",
  //       from: "comments",
  //       localField: "_id",
  //       foreignField: "video",
  //     },
  //   },
  //   {
  //     $project: {
  //       thumbnail: 1,
  //       owner: 1,
  //       title: 1,
  //       description: 1,
  //       duration: 1,
  //       isPublished: 1,
  //       views: 1,
  //       likeCount: { $size: "$like" },
  //       commentCount: { $size: "$comment" },
  //       createdAt: 1,
  //       updatedAt: 1,
  //     },
  //   },
  // ]);

  const videoDetails = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        videosCount: { $sum: 1 },
        viewsCount: { $sum: "$views" },
        likesCount: { $sum: "$likes" },
      },
    },
    {
      $project: {
        videosCount: 1,
        viewsCount: 1,
        likesCount: 1,
      },
    },
  ]);

  const {
    videosCount = 0,
    viewsCount = 0,
    likesCount = 0,
  } = videoDetails[0] || {};

  const stats = {
    totalSubscribers,
    totalViews: viewsCount,
    totalVideos: videosCount,
    totalLikes: likesCount,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "status fetched succesffully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user?._id?.toString();
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid Object Id");
  }

  const videos = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $project: {
        thumbnail: 1,
        title: 1,
        duration: 1,
        isPublished: 1,
        views: 1,
        likes: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videos, totalVideo: videos?.length || 0 },
        "videos is fetched successfully"
      )
    );
});

export { getChannelStats, getChannelVideos };
