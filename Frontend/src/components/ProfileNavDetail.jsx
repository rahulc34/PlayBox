import React from "react";
import VideoList from "./VideoList.jsx";
import PlaylistCard from "./PlaylistCard.jsx";
import PostList from "./PostList.jsx";
import Subscribers from "../pages/userPages/Subscribers.jsx";
import SubscribedTo from "../pages/userPages/SubscribedTo.jsx";

function ProfileNavDetail({ state, userId }) {
  switch (state) {
    case "videos":
      return userId && <VideoList userId={userId} />;
      break;
    case "playlists":
      return userId && <PlaylistCard userId={userId} />;
      break;
    case "posts":
      return userId && <PostList userId={userId} />;
      break;
    case "subscribers":
      return userId && <Subscribers userId={userId} />;
      break;
    case "suscribedTo":
      return userId && <SubscribedTo userId={userId} />;
      break;
    default:
      break;
  }
}

export default ProfileNavDetail;
