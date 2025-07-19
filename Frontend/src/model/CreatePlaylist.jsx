import React, { useState } from "react";
import "../cssStyles/CreatePlaylist.css";
import { axiosPrivate } from "../api/axios";

function CreatePlaylist({
  state,
  playlistId,
  setPlaylists,
  playlists,
  setPlaylistDetail,
  playlistDetail,
}) {
  const [title, setTitle] = useState(playlistDetail?.name || "");
  const [description, setDescription] = useState(
    playlistDetail?.description || ""
  );
  const [isPrivate, setIsPrivate] = useState(
    playlistDetail?.isPrivate ? "private" : "public"
  );
  const [loading, setLoading] = useState(false);
  const [created, setcreated] = useState(false);
  const [error, setError] = useState("");

  const editPlaylist = async () => {
    try {
      setLoading(true);
      setcreated(false);
      setError("");
      const content = {
        name: title,
        description,
        isPrivate: isPrivate === "private",
      };

      const response = await axiosPrivate.patch(
        `/api/v1/playlist/${playlistId}`,
        content
      );
      if (response.data.success) {
        setcreated(true);
        setPlaylistDetail({ ...playlistDetail, ...content });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  const submitHandler = async () => {
    try {
      setLoading(true);
      setcreated(false);
      setError("");
      const content = {
        name: title,
        description,
        isPrivate: isPrivate === "private",
      };
      const response = await axiosPrivate.post("/api/v1/playlist", content);
      const data = response.data;
      if (data.success && data.data) {
        setcreated(true);
        const { _id, name, description, owner } = data.data;
        const createdPlaylist = {
          _id,
          name,
          description,
          owner,
          totalVideos: 0,
        };
        setPlaylists([...playlists, createdPlaylist]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  if (created) {
    return state === "edit" ? (
      <h2>Playlist edited successfully</h2>
    ) : (
      <h1>Playlist is created successfully</h1>
    );
  }

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="createPlaylistWrapper">
      <p>{state === "edit" ? "Edit" : "New"} Playlist</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (state === "edit") editPlaylist();
          else submitHandler();
        }}
      >
        <div className="inputContainer">
          <span>Title</span>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <span>Description</span>
          <input
            type="text"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="private" className="private">
            Private
          </label>
          <input
            type="radio"
            id="private"
            checked={isPrivate === "private"}
            onChange={(e) => {
              setIsPrivate("private");
            }}
          />
          <label htmlFor="public" className="private">
            Public
          </label>
          <input
            type="radio"
            id="public"
            checked={isPrivate === "public"}
            onChange={(e) => {
              setIsPrivate("public");
            }}
          />
        </div>
        <div className="btncontainer">
          <button className="create">
            {state === "edit" ? "Edit" : "Create"}
          </button>
        </div>
      </form>
      {error && (
        <div className="error" style={{ maxWidth: "220px" }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default CreatePlaylist;
