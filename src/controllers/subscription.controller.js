import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;
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

  const isSubscribed = await Subscription.find(query);

  if (!isSubscribed) {
    await Subscription.create(query);
  } else {
    await Subscription.deleteOne(query);
  }

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

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
