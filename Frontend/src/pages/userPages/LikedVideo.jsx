import React from "react";
import { useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { useEffect } from "react";
import VideoCard from "../../components/VideoCard";
import UserHeader from "../../components/UserHeader";
import EmptyPage from "../../components/EmptyPage";
import CenterDiv from "../../components/CenterDiv";

function LikedVideo() {
  const [videos, setVideos] = useState();

  const getLikedVideos = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/likes/videos`);
      const data = response.data;
      if (data.success) {
        setVideos(data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  // console.log(videos);

  useEffect(() => {
    getLikedVideos();
  }, []);
  return (
    <>
      <div className="playlist-header">
        <p className="name">{`${videos?.length}`} Liked videos</p>
      </div>
      <div className="grid-container">
        {videos?.length
          ? videos.map(({ videoList }) => (
              <VideoCard {...videoList} key={videoList._id} />
            ))
          : ""}
        {!videos?.length && (
          <CenterDiv>
            <EmptyPage
              title="No Video found"
              desc="this channel has yet to upload videos"
            />
          </CenterDiv>
        )}
      </div>
    </>
  );
}

export default LikedVideo;
