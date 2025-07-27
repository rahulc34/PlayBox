import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  //TODO: get all comments for a video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  const skip = (page - 1) * limit;

  // Fetch comments using aggregation pipeline
  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
        parentComment: null,
      },
    },
    { $sort: { createdAt: -1 } }, // Sort by newest first
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        as: "user",
        localField: "owner",
        foreignField: "_id",
        from: "users",
      },
    },
    { $unwind: "$user" },
    {
      $addFields: {
        username: "$user.username",
        avatar: "$user.avatar",
        reply: {
          $size: { $ifNull: ["$commentList", []] },
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        as: "likes",
        localField: "_id",
        foreignField: "comment",
      },
    },
    {
      $addFields: {
        likedby: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
        likes: {
          $size: "$likes",
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        video: 1,
        username: 1,
        avatar: 1,
        owner: 1,
        reply: 1,
        createdAt: 1,
        likes: 1,
        likedby: 1,
      },
    },
  ]);

  // Get total count of comments for the video
  const totalComments = await Comment.countDocuments({
    video: new mongoose.Types.ObjectId(videoId),
  });

  // Handle empty results
  if (comments.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No comments found for this video"));
  }

  const response = {
    comments,
    total: totalComments,
    page: parseInt(page),
    limit: parseInt(limit),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const owner = req.user._id.toString();
  const { content } = req.body;
  // TODO: add a comment to a video
  // check if video and owner id is valid object id
  // check if video is existed in db
  // create the comment
  // return the response

  // Trim content before validation
  if (!content || !content.trim()) {
    throw new ApiError(400, "Content should not be empty");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  if (!isValidObjectId(owner)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // check if video is existed in database
  const videoIsExist = await Video.findById(videoId);
  if (!videoIsExist) {
    throw new ApiError(404, "Video does not exist");
  }

  // creating the comment
  const comment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner,
  });

  // check if comment is created
  if (!comment) {
    throw new ApiError(500, "Error occurred while creating the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added successfully to video"));
});

const addReplyToComment = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.params;
  const { content } = req.body;
  const user = req.user._id.toString();

  if (!content || !content.trim()) {
    throw new ApiError(400, "please enter content");
  }
  console.log(videoId, commentId);
  if (!isValidObjectId(videoId) && !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid object id");
  }

  const comment = await Comment.findById(commentId);
  if (comment.video.toString() !== videoId) {
    throw new ApiError(400, "Invalid video id");
  }

  const createCommentReply = await Comment.create({
    content,
    video: videoId,
    owner: user,
    parentComment: comment._id,
  });

  if (!createCommentReply) {
    throw new ApiError(400, "error while reply creation");
  }
  comment.commentList.push(createCommentReply._id);
  await comment.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createCommentReply,
        "reply is added to comment successfully"
      )
    );
});

const getAllReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const user = req.user._id.toString();

  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment object id");
  }

  const skip = (page - 1) * limit;
  const comments = await Comment.aggregate([
    {
      $match: {
        parentComment: new mongoose.Types.ObjectId(commentId),
      },
    },
    { $sort: { createdAt: -1 } }, // Sort by newest first
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        as: "user",
        localField: "owner",
        foreignField: "_id",
        from: "users",
      },
    },
    { $unwind: "$user" },
    {
      $addFields: {
        username: "$user.username",
        avatar: "$user.avatar",
        reply: {
          $size: { $ifNull: ["$commentList", []] },
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        as: "likes",
        localField: "_id",
        foreignField: "comment",
      },
    },
    {
      $addFields: {
        likedby: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
        likes: {
          $size: "$likes",
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        video: 1,
        username: 1,
        avatar: 1,
        owner: 1,
        reply: 1,
        createdAt: 1,
        likes: 1,
        likedby: 1,
      },
    },
  ]);

  const totalComments = await Comment.countDocuments({
    parentComment: new mongoose.Types.ObjectId(commentId),
  });

  // Handle empty results
  if (comments.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No comments found for this video"));
  }

  const response = {
    comments,
    total: totalComments,
    page: parseInt(page),
    limit: parseInt(limit),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Comments fetched successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const owner = req.user._id.toString();
  const { content } = req.body;
  // TODO: update a comment

  // validate the comment
  if (!content || !content.trim()) {
    throw new ApiError(400, "content should not be empty");
  }

  // validate the comment id
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment iD");
  }

  // validating the comment
  const comment = await Comment.findOne({ _id: commentId, owner });
  if (!comment) {
    throw new ApiError(
      400,
      "comment not found or you are not authorized to update the comment"
    );
  }

  // Avoid saving if the content is unchanged
  if (comment.content === content.trim()) {
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "No changes made to the comment"));
  }

  // updating the comment
  comment.content = content.trim();
  const updatedComment = await comment.save();

  if (!updatedComment) {
    throw new ApiError(500, "Error while updating the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "commnet updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const owner = req.user._id.toString();
  // TODO: delete a comment

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  if (!isValidObjectId(owner)) {
    throw new ApiError(400, "Invalid user Id");
  }

  // get the comment from db
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError("comment does not exist");
  }

  //check if owner is deleting the comment
  if (comment.owner?.toString() !== owner) {
    throw new ApiError(400, "unauthorize access");
  }

  await Like.deleteMany({ commentId: commentId });
  const childComments = await Comment.find({ parentComment: commentId }, "_id");
  const childCommentIds = childComments.map((c) => c._id);
  await Like.deleteMany({ commentId: { $in: childCommentIds } });

  await Comment.deleteMany({ parentComment: commentId });
  await Comment.findByIdAndDelete(commentId);
  await Comment.updateOne(
    { commentList: commentId },
    { $pull: { commentList: commentId } }
  );

  //also delete all liked comment
  return res
    .status(200)
    .json(new ApiResponse(200, null, "comment deleted succsessfully"));
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  addReplyToComment,
  getAllReplies,
};
