import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const owner = req.user?._id?.toString();
  const { content } = req.body;
  //TODO: create tweet

  if (!content || !content.trim()) {
    throw new ApiError(400, "content should not be empty");
  }
  if (!isValidObjectId(owner)) {
    throw new ApiError(400, "Invalid userId");
  }

  // check for the duplicate tweet
  const duplicateTweet = await Tweet.findOne({
    content: content.trim(),
    owner,
  });
  if (duplicateTweet) {
    throw new ApiError(400, "Duplicate tweet detected");
  }

  //creating the tweet
  const tweet = await Tweet.create({ content: content.trim(), owner });
  if (!tweet) {
    throw new ApiError(500, "Error while creating the tweet");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { id: tweet._id, content: tweet.content },
        "tweet created successfully"
      )
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // TODO: get user tweets

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;
  const userId = req.user?._id?.toString();
  //TODO: update tweet

  if (!content || !content.trim()) {
    throw new ApiError(400, "tweet should not be empty");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid userId");
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  // validate tweet exist and user is authorized
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Tweet does not exist");
  }
  if (tweet.owner.toString() !== userId) {
    throw new ApiError(404, "you are not authorized");
  }

  // update the tweet
  tweet.content = content.trim();
  const updatedComment = await tweet.save();

  // return the tweet
  return res
    .status(200)
    .json(new ApiResponse(200, updateTweet, "tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const owner = req.user?._id?.toString();
  //TODO: delete tweet

  // validate the id
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet Id");
  }
  if (!isValidObjectId(owner)) {
    throw new ApiError(400, "Invalid user Id");
  }

  // deleting the comment
  const tweet = await Tweet.findOneAndDelete({ _id: tweetId, owner });
  if (!tweet) {
    throw new ApiError(
      404,
      "Tweet not found or you are not authorize to delete it"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
