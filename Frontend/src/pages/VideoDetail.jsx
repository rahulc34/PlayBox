import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios.js";
import VideoDetailCard from "../components/VideoDetailCard.jsx";
import VideoList from "../components/VideoList.jsx";
import "../cssStyles/videoDetail.css";

function VideoDetail() {
  const { videoId } = useParams();
  const [video, setVideo] = useState("");
  const [comment, setComment] = useState("");
  const [isviewes, setIsView] = useState(false);

  const getVideoById = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/videos/${videoId}`);
      const data = response.data;

      if (data.success) {
        setVideo(data.data);
        // console.log(data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };


  const viewIncrease = async () => {
    if (!video) return;
    // console.log("increasing the views");
    try {
      const response = await axiosPrivate.patch(
        `/api/v1/videos/saveIncView/${videoId}`
      );
      // console.log("response", response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getVideoById();
    // getComment();
    const timeToIncreaseView =
      20 >= video.duration ? (video.duration / 2) * 1000 : 10000;
    // console.log(timeToIncreaseView);
    const intervalId = setTimeout(() => {
      // console.log("view incresing");
      viewIncrease();
    }, timeToIncreaseView);

    // console.log("intervalind", intervalId);
    return () => {
      // console.log("cleanup");
      clearTimeout(intervalId);
    };
  }, [videoId]);

  return (
    <div className="videoDetailWrapper">
      <div className="videoDetailCard">
        {video && <VideoDetailCard video={video} setVideo={setVideo} />}
      </div>
      {video && <VideoList />}
    </div>
  );
}

export default VideoDetail;
