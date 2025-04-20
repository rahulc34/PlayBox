import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
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
  console.log("path-->", videoFilepath, thumbnailpath);

  const videoFile = await uploadOnCloudinary(videoFilepath);
  const thumbnail = await uploadOnCloudinary(thumbnailpath);

  console.log("url-->", videoFile?.url, thumbnail?.url);
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
    isPublished: true,
  });

  if (!video) {
    throw new ApiError(500, "something went wront while creating video schema");
  }
  console.log("created video schema --> ", video);

  return res
    .status(201)
    .json(new ApiResponse(200, video, "video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  // verify the video id of mongoose

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
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
              isSubscibed: {
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
              isSubscibed: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
  ]);

  console.log(video);

  if (!video || video.length === 0) {
    throw new ApiError(400, "Video not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, video[0], "video is fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
