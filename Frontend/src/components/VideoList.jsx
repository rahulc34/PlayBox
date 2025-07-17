import React from "react";
import { axiosPrivate } from "../api/axios";
import { useEffect, useState } from "react";
import VideoCard from "./VideoCard.jsx";
import "../cssStyles/VideoCard.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import EmptyPage from "./EmptyPage.jsx";
import UserHeader from "./UserHeader.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

function VideoList({ userId }) {
  const [videos, setVideos] = useState(null);
  const query = `?page=1` + (userId ? `&userId=${userId}` : "");
  const { user } = useAuth();

  const getVideos = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/videos${query}`, {
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
    <>
      {userId === user._id && (
        <UserHeader title="Videos" count={videos?.length} />
      )}
      <div className="grid-container">
        {videos &&
          videos.map((video) => <VideoCard {...video} key={video._id} />)}
        {videos && !videos.length && userId && (
          <EmptyPage
            title="No Video found"
            desc="this channel has yet to upload videos"
          />
        )}
      </div>
    </>
  );
}

export default VideoList;
