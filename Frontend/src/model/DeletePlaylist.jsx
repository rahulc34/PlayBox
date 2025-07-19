import React, { useState } from "react";
import "../cssStyles/CreatePlaylist.css";
import { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";

const DeletePlaylist = ({ playlistId, setPlaylists, playlists }) => {
  const [loading, setLoading] = useState(false);
  const [created, setcreated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const deletePlaylist = async () => {
    try {
      setLoading(true);
      setcreated(false);
      setError("");
      const response = await axiosPrivate.delete(
        `/api/v1/playlist/${playlistId}`
      );
      if (response.data.success) {
        setcreated(true);
        const newplaylists = [];
        for (let playlist of playlists) {
          if (playlist._id !== playlistId) newplaylists.push(playlist);
        }
        setPlaylists(newplaylists);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  if (created) return <h2>Playlist deleted successfully</h2>;

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="createPlaylistWrapper deletemenu">
      <button
        onClick={() => {
          deletePlaylist();
        }}
      >
        Delete
      </button>
    </div>
  );
};

export { DeletePlaylist };
