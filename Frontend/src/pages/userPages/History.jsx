import React from "react";
import { axiosPrivate } from "../../api/axios";
import { useEffect } from "react";
import VideoCard from "../../components/VideoCard";
import { useState } from "react";
import CenterDiv from "../../components/CenterDiv";
import EmptyPage from "../../components/EmptyPage";

function History() {
  const [videos, setVideos] = useState("");
  const getHistory = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/users/history");
      const data = response.data;
      if (data.success) {
        console.log("history-->");
        console.log(data.data);
        setVideos(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="grid-container">
      {videos &&
        videos.map((video) => <VideoCard {...video} key={video._id} />)}
      {videos && !videos.length && (
        <CenterDiv>
          <EmptyPage title="History is empty" desc="you have yet to see video" />
        </CenterDiv>
      )}
    </div>
  );
}

export default History;
