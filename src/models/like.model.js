import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
  },
  tweet: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
  },
  likedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Like = new mongoose.model("Like", likeSchema);
