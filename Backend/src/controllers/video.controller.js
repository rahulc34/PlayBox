import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { title } from "process";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  // page ---> for which page the user is on ie, 1, 2, 3, ---
  // limit ---> no. of documents per page by default 10
  // sortType if for sorting order i.e ascending or descending
  // sortBy ----> sort by the upload date or views or duration
  // duration ---> sort, medium , long
  // userId ---> for getting videos of a user. when vieving the channel
  // channel ---> channel search
  const {
    page = 1,
    limit = 10,
    sortType = "desc", // desc, asc
    sortBy = "createdAt", // createdAt or views
    uploadDate, //hour, today, week, month, year
    duration, // short, medium , long
    userId,
    query,
  } = req.query;

  const filter = {};
  // filter on getting all video of user ---> request by any user to see his or others videos account
  if (userId) {
    filter.owner = new mongoose.Types.ObjectId(userId);
    if (userId !== req.user._id.toString()) {
      filter.isPublished = true;
    }
  } else filter.isPublished = true;

  // filter on query done by any user in search field
  if (query) {
    filter.$text = {
      $search: query,
      $caseSensitive: false,
    };
  }

  // filter on duration of query videos
  if (duration) {
    if (duration === "short") {
      // Less than 4 minutes
      filter.duration = { $lt: 4 * 60 };
    } else if (duration === "medium") {
      // Between 4 and 20 minutes
      filter.duration = { $gte: 4 * 60, $lte: 20 * 60 };
    } else if (duration === "long") {
      // Greater than 20 minutes
      filter.duration = { $gt: 20 * 60 };
    }
  }

  //sorting order
  const sortOrder = sortType === "asc" ? 1 : -1;
  const sortOptions = {
    [sortBy]: sortOrder,
  };

  if (uploadDate) {
    const date = new Date();
    const [year, month, hour, currDate] = [
      date.getFullYear(),
      date.getMonth(),
      date.getHours(),
      date.getDate(),
    ];

    if (uploadDate === "hour") {
      const startHour = new Date();
      startHour.setHours(hour - 1);
      filter.createdAt = { $gt: startHour };
    } else if (uploadDate === "today") {
      const startToday = new Date();
      startToday.setHours(0, 0, 0, 0);
      filter.createdAt = { $gt: startToday };
    } else if (uploadDate === "week") {
      const startWeek = new Date();
      startWeek.setDate(currDate - date.getDay());
      startWeek.setHours(0, 0, 0, 0);
      filter.createdAt = { $gt: startWeek };
    } else if (uploadDate === "month") {
      const startMonth = new Date();
      startMonth.setDate(1);
      startMonth.setHours(0, 0, 0, 0);
      filter.createdAt = { $gt: startMonth };
    } else if (uploadDate === "year") {
      const startYear = new Date();
      startYear.setMonth(0);
      startYear.setDate(1);
      startYear.setHours(0, 0, 0, 0);
      filter.createdAt = { $gt: startYear };
    }
  }

  const skip = (page - 1) * limit;

  // pipeline for query
  const pipeline = [
    { $match: filter },
    { $sort: sortOptions },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ];

  if (!userId) {
    pipeline.push(
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
          videoFile: 1, // remove this later bcz user will see video when he click and fetch video from db by videoid
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
      }
    );
  }

  // get videos from database
  const videos = await Video.aggregate(pipeline);
  //count all documents
  const totalVideos = await Video.countDocuments(filter);

  //return the response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        pagination: {
          total: totalVideos,
          page: parseInt(page),
          limit: parseInt(limit),
        },
      },
      "Video is fetched successfully"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  const user = req.user;
  // TODO: get video, upload to cloudinary, create video
  //get the title and description from the req body
  //get the video and thumbnail file path from req.files
  //upload on cloudinary
  //create video schema using mongoose
  //return respose of 200

  const videoFilepath = req.files?.videoFile[0].path;
  const thumbnailpath = req.files?.thumbnail[0].path;

  if (!videoFilepath || !thumbnailpath) {
    throw new ApiError(
      400,
      `${!videoFilepath ? "videoFile" : "thumbnail"} is missing`
    );
  }

  const videoFile = await uploadOnCloudinary(videoFilepath);
  const thumbnail = await uploadOnCloudinary(thumbnailpath);

  if (!videoFile) {
    throw new ApiError(500, "failed to upload the video");
  }

  const video = await Video.create({
    owner: user._id,
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail?.url || "",
    duration: videoFile.duration,
    views: 0,
    likes: 0,
    isPublished,
  });

  if (!video) {
    throw new ApiError(500, "something went wront while creating video schema");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, null, "video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = new mongoose.Types.ObjectId(req.user._id);
  // TODO: get video by id
  // verify the video id of mongoose
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const videoDetail = await Video.findById(videoId);

  if (
    !videoDetail.isPublished &&
    userId.toString() !== videoDetail.owner.toString()
  ) {
    throw new ApiError(400, "video is private");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        as: "owner",
        localField: "owner",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              as: "subscribers",
              localField: "_id",
              foreignField: "channel",
            },
          },
          {
            $addFields: {
              subscribersCount: {
                $size: "$subscribers",
              },
              isSubscribed: {
                $cond: {
                  if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
              subscribersCount: 1,
              isSubscribed: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
  ]);

  if (!video || video.length === 0) {
    throw new ApiError(400, "Video not found");
  }

  const likedby = await Like.findOne({
    video: new mongoose.Types.ObjectId(videoId),
    likedBy: userId,
  });

  likedby ? (video[0].likedby = true) : (video[0].likedby = false);

  const alreadySaved = await Playlist.findOne({
    owner: userId,
    videos: new mongoose.Types.ObjectId(videoId),
  });

  if (alreadySaved) {
    video[0].PlaylistId = alreadySaved._id;
  }

  return res
    .status(201)
    .json(new ApiResponse(200, video[0], "video is fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  //validate videoid
  //get video from database
  //check user id === vide.owner
  //them update the title and descrciption
  //send message of updated succesfully

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  if (req.user?._id?.toString() !== video?.owner?.toString()) {
    throw new ApiError(400, "Unauthorized video file");
  }

  const { title, description, isPublished } = req.body;
  const thumbnailpath = req.file?.path;
  const thumbnailPublicId = video.thumbnail?.split("/")?.pop()?.split(".")?.[0];

  let updatedVideo;
  if (thumbnailpath) {
    const respose = await uploadOnCloudinary(thumbnailpath);
    await deleteFromCloudinary(thumbnailPublicId, "image");
    const thumbnail = respose.url;

    updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: { title, description, thumbnail, isPublished },
      },
      { new: true }
    );

    if (!updateVideo) {
      throw new ApiError(
        400,
        "something went wrong while updating title and desctiption"
      );
    }
  } else {
    updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: { title, description, isPublished },
      },
      { new: true }
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, updatedVideo, "video is updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  //validate the video id
  //get video from database
  //verify the user id to video owner id
  //delete video from the mongoose
  //delete video from cloudinary
  //return res of successfull

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video is not found! Invalid video Id");
  }

  if (req.user?._id.toString() !== video.owner.toString()) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  // deleting from the cloudinary video and its thumbnail
  // Extract publicId from the Cloudinary URLs
  const videoPublicId = video.videoFile.split("/").pop().split(".")[0];
  const thumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];

  const videoResult = await deleteFromCloudinary(videoPublicId, "video");
  const thumbnailResult = await deleteFromCloudinary(
    thumbnailPublicId,
    "image"
  );
  //deleting video details from database
  await Video.findByIdAndDelete(video._id);

  await Playlist.updateMany(
    { videos: video._id },
    { $pull: { videos: video._id } }
  );

  await Like.deleteAll({ video: video._id });

  await Comment.deleteAll({ video: video._id });

  await User.updateMany(
    { watchHistory: video._id },
    { $pull: { watchHistory: video._id } }
  );

  return res
    .status(201)
    .json(new ApiResponse(200, "video deleted succesfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //validate videoId
  //find the video
  //check the video is of user
  //update the video of publish by true to false or false to true
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  if (req.user?._id.toString() !== video?.owner.toString()) {
    throw new ApiError(400, "Unauthorized video file");
  }

  await Video.findByIdAndUpdate(videoId, {
    $set: {
      isPublished: !video.isPublished,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(200, "toggle publish status successfully"));
});

const increaseLikeAndSaveToHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Video id is not valid");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  const user = await User.findById(req.user._id);
  user.watchHistory.push(videoId);
  video.views = (video?.views || 0) + 1;

  await video.save();
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "views increased"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  increaseLikeAndSaveToHistory,
};
