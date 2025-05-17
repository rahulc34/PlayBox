import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id.toString();
  // TODO: toggle subscription

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (userId === channelId) {
    throw new ApiError(400, "you cannot subscribed to yourself");
  }

  const query = {
    channel: channelId,
    subscriber: userId,
  };

  const isSubscribed = await Subscription.findOne(query);

  console.log(isSubscribed);
  !isSubscribed
    ? await Subscription.create(query)
    : await Subscription.deleteOne(query);

  // Get updated subscription count
  const subscriptionCount = await Subscription.countDocuments({
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscriptionCount },
        `channel is ${isSubscribed ? "unsubscribed" : "subscribed"} sucessfully`
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id.toString();
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (channelId !== userId) {
    throw new ApiError(400, "you are not authorized");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: { channel: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        _id: "$user._id",
        username: "$user.username",
        fullname: "$user.fullname",
        avatar: "$user.avatar",
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        fullname: 1,
        avatar: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "subscribers of channel is fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const userId = req.user._id.toString();

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "invalid id");
  }

  if (subscriberId !== userId) {
    throw new ApiError(404, "unauthorize access");
  }

  const subscribedChannel = await Subscription.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) },
    },
    {
      $lookup: {
        as: "channel",
        localField: "channel",
        foreignField: "_id",
        from: "users",
        pipeline: [
          {
            $lookup: {
              as: "subscribers",
              localField: "_id",
              foreignField: "channel",
              from: "subscriptions",
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
        ],
      },
    },
    {
      $unwind: "$channel",
    },
    {
      $addFields: {
        _id: "$channel._id",
        username: "$channel.username",
        email: "$channel.email",
        fullname: "$channel.fullname",
        avatar: "$channel.avatar",
        subscribersCount: "$channel.subscribersCount",
        isSubscibed: "$channel.isSubscibed",
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        fullname: 1,
        email: 1,
        avatar: 1,
        subscribersCount: 1,
        isSubscibed: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannel,
        "subscribed channel is fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
