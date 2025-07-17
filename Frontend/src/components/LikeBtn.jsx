import React from "react";
import { axiosPrivate } from "../api/axios";
import { useState } from "react";

const LikeBtn = ({ likes, videoId }) => {
  const [like, setLike] = useState(likes);
  const toggleTweetLike = async () => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/likes/toggle/v/${videoId}`
      );
      const data = response.data;

      if (data.success) {
        setLike(data.data?.like);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      className="like"
      onClick={() => {
        console.log("clicked");
        toggleTweetLike();
      }}
    >
      <p style={{ color: "white" }}>{like}</p>
      <img src="./dsfjk" />
    </button>
  );
};

export default LikeBtn;
