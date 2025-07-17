import React from "react";
import PlaylistCard from "../../components/PlaylistCard";
import { useAuth } from "../../contexts/AuthContext";

function Playlist() {
  const { user } = useAuth();
  return <PlaylistCard userId={user._id} />;
}

export default Playlist;
