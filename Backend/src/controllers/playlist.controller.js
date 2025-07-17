import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const owner = req.user._id.toString();
  //TODO: create playlist
  // check is name is valid
  // check if user is creating playlist with name he already created
  // create the playlist
  // return the response

  if (!name) {
    return new ApiError(400, "Please enter a name for playlist");
  }

  //checking if user is making using duplicate name of playlist
  const isPlaylistExist = await Playlist.findOne({ name, owner });
  if (isPlaylistExist) {
    throw new ApiError(400, "this name is already exist");
  }

  //creating the playlist
  const createdPlaylist = await Playlist.create({
    name,
    description,
    owner,
    videos: [],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdPlaylist, `playlist is created successfully`)
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  // validate userid and check userId
  // get all playlist from the database

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "invalid user ID");
  }

  // const userPlaylist = await Playlist.find({ owner: userId }).select("-videos");

  const userPlaylist = await Playlist.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $addFields: {
        totalVideos: {
          $size: "$videos",
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        owner: 1,
        totalVideos: 1,
        private: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "All playlist is fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  // check if playlist id is valid mongodb id
  // find the playlist in db
  // check if playlist owner is user
  // return response
  console.log(playlistId);

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist ID");
  }

  const isPlaylistExist = await Playlist.findById(playlistId);
  if (!isPlaylistExist) {
    throw new ApiError(400, "Playlist doesn't exists");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(playlistId) },
    },
    {
      $lookup: {
        as: "owner",
        localField: "owner",
        foreignField: "_id",
        from: "users",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        as: "videos",
        localField: "videos",
        foreignField: "_id",
        from: "videos",
        pipeline: [
          {
            $lookup: {
              as: "owner",
              from: "users",
              localField: "owner",
              foreignField: "_id",
            },
          },
          {
            $unwind: "$owner",
          },
          {
            $project: {
              _id: 1,
              title: 1,
              thumbnail: 1,
              duration: 1,
              createdAt: 1,
              isPublished: 1,
              views: 1,
              "owner.username": 1,
              "owner.avatar": 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        owner: 1,
        videos: 1,
        private: 1,
      },
    },
  ]);

  if (!playlist.length) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist[0], "playlist is fetched successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user._id;
  // check if playlist id or videoId is valid
  // check if playlist is exit
  // check if video is exist
  // push the video id in the playlist array
  // return the response

  //validating the database id of mongodb
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, `invalid playlistId`);
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid videoId");
  }

  // checking teh playlist exist or user is authorized
  const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });
  if (!playlist) {
    throw new ApiError(404, "playlist is not exist or unauthorized error");
  }

  // check if video is already in the playlist
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "video is already add to playlist");
  }

  // check if video is exist in video collection
  const existedVideo = await Video.findOne({ _id: videoId });
  if (!existedVideo) {
    throw new ApiError(400, "Video is not existed");
  }

  // add the video in the playlist
  playlist.videos.push(videoId);
  const updatedPlaylist = await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatePlaylist,
        "video is added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const owner = req.user._id;
  // TODO: remove video from playlist
  // check if id are the valid object id
  // check if playlist is exit
  // delete the videoId from the playlist videos
  // return the response

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlistId");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlistId");
  }

  const playlist = await Playlist.findOne({ _id: playlistId, owner });
  if (!playlist) {
    throw new ApiError(400, "playlist is not exist");
  }

  playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
  await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        "video is deleted from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const owner = req.user._id;
  // TODO: delete playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist id");
  }

  // Check if playlist exists and user is authorized
  const playlist = await Playlist.findOne({ _id: playlistId, owner });
  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized access");
  }

  // deleting the playlist and check response
  const response = await Playlist.deleteOne({ _id: playlistId, owner });
  if (!response.acknowledged) {
    throw ApiError(400, "Error while deleting the playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  const owner = req.user._id;
  //TODO: update playlist
  // validate the name and playlist id
  // check if playlist is exist and the user is authorized
  // update the name or description
  // return the response

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist ID");
  }

  if (!name) {
    throw new ApiError(400, "name is required");
  }

  const playlist = await Playlist.findOne({ _id: playlistId, owner });
  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized access");
  }

  playlist.name = name;
  playlist.description = description;

  const updatedPlaylist = await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatePlaylist, "playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
