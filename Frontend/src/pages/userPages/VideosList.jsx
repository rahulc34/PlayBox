import React from "react";
import VideoList from "../../components/VideoList";
import { useAuth } from "../../contexts/AuthContext";

function VideosList() {
  const { user } = useAuth();
  return <VideoList userId={user._id} />;
}

export default VideosList;
