import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios.js";
import VideoDetailCard from "../components/VideoDetailCard.jsx";
import Comment from "../components/Comment.jsx";
import VideoList from "../components/VideoList.jsx";
import "../cssStyles/videoDetail.css";
import axios from "axios";

function VideoDetail() {
  const { videoId } = useParams();
  const [video, setVideo] = useState("");
  const [comment, setComment] = useState("");

  const getVideoById = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/videos/${videoId}`);
      const data = response.data;

      if (data.success) {
        setVideo(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getComment = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/comments/${videoId}`);
      const data = response.data;
      console.log(data);
      if (data.success) setComment(data.data);
      else setComment(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getVideoById();
    getComment();
  }, [videoId]);

  return (
    <div className="videoDetailWrapper">
      <div className="videoDetailCard">
        {video && <VideoDetailCard {...video} />}
        {video && comment ? (
          <Comment {...comment} />
        ) : (
          <h1>No comment Found</h1>
        )}
      </div>
      {video && <VideoList />}
    </div>
  );
}

export default VideoDetail;
