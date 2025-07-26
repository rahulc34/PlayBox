import React, { useState } from "react";
import "../cssStyles/CreatePlaylist.css";
import { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";

const DeletePlaylist = ({
  playlistId,
  setPlaylists,
  playlists,
  deleteVideoId,
  setChannelVideo,
  state,
}) => {
  const [loading, setLoading] = useState(false);
  const [created, setcreated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const deleteVideo = async () => {
    try {
      setLoading(true);
      setcreated(false);
      setError("");
      const response = await axiosPrivate.delete(
        `/api/v1/videos/${deleteVideoId}`
      );
      if (response.data.success) {
        setcreated(true);
        const newVideos = [];
        for (let video of newVideos) {
          if (video._id !== deleteVideoId) newVideos.push(video);
        }
        setChannelVideo(newVideos);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

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

  if (created)
    return (
      <h2>
        {state === "deleteVideo" ? "video" : "playlist"} deleted successfully
      </h2>
    );
  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <div className="createPlaylistWrapper deletemenu">
        <button
          onClick={() => {
            if (state === "deleteVideo") deleteVideo();
            else deletePlaylist();
          }}
        >
          Delete
        </button>
      </div>
      {error && <Error message={error} />}
    </>
  );
};

export { DeletePlaylist };
