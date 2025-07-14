import React from "react";
import { axiosPrivate } from "../api/axios";
import { useEffect, useState } from "react";
import VideoCard from "./VideoCard.jsx";
import "../cssStyles/VideoCard.css";
import axios from "axios";

function VideoList() {
  
  const [videos, setVideos] = useState(null);

  const getVideos = async () => {
    try {
      const response = await axios.get("/api/v1/videos?page=4", {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        const fetchedVideos = data.data.videos;
        const { page, limit, total } = data.data.pagination;
        setVideos(fetchedVideos);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);
  return (
    <div className="grid-container">
      {videos &&
        videos.map((video) => <VideoCard {...video} key={video._id} />)}
    </div>
  );
}

export default VideoList;
