import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import { axiosPrivate } from "../api/axios";
import { cn } from "../lib/cn";

const LikeBtn = ({ video, setVideo }) => {
  const { likedby } = video || {};

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
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTweetLike}
      className={cn(
        "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        likedby
          ? "border-violet-200 bg-violet-50 text-violet-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      )}
    >
      <ThumbsUp size={16} className={likedby ? "fill-violet-600" : ""} />
      {video?.likes || 0}
    </button>
  );
};

export default LikeBtn;
