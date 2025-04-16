import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

export const Playlist = new mongoose("Playlist", playlistSchema);
