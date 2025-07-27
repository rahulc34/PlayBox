import React from "react";
import { axiosPrivate } from "../api/axios";
import { useState } from "react";
import dislikelogo from "../assests/thumb.png";
import likelogo from "../assests/like.png";

const LikeBtn = ({ video, setVideo }) => {
  const { likedby } = video || {};
  const likeBtnUrl = likedby ? likelogo : dislikelogo;

  const toggleTweetLike = async () => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/likes/toggle/v/${video._id}`
      );
      const data = response.data;

      if (data.success) {
        setVideo({
          ...video,
          likes: data?.data?.likes || 0,
          likedby: !likedby,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      className="like"
      onClick={() => {
        toggleTweetLike();
      }}
    >
      <p>{video?.likes || 0}</p>
      <img src={likeBtnUrl} />
    </button>
  );
};

export default LikeBtn;
