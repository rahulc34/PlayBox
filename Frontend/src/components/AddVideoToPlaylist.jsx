import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { axiosPrivate } from "../api/axios";
import EmptyPage from "../components/EmptyPage.jsx";
import UserHeader from "./UserHeader.jsx";
import CreatePlaylist from "../model/CreatePlaylist.jsx";
import Model from "../model/Model.jsx";
import Error from "./Error.jsx";

function AddVideoToPlaylist({
  isSaved,
  setIsClosePlaylistAdd,
  videoId,
  setIsSaved,
}) {
  const { user } = useAuth();
  const [playlistId, setPlaylistId] = useState("");
  const [playlists, setPlaylists] = useState("");
  const [openCreatePlaylist, setOpenCreatePlylist] = useState(false);

  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState("");
  const [onSuccess, setOnSuccess] = useState("");

  const getAllPlaylist = async () => {
    try {
      setIsError(false);
      setLoading(true);
      setOnSuccess(false);
      const response = await axiosPrivate.get(
        `/api/v1/playlist/user/${user._id}`
      );
      const data = response.data;
      if (data.success) {
        setPlaylists(data.data);
        console.log(data.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError(error.response?.data?.message);
    }
  };

  const addPlaylistHandler = async () => {
    if (!playlistId) {
      setIsError("Please select a playlist");
      return;
    }

    try {
      setIsError(false);
      setLoading(true);
      setOnSuccess(false);
      const response = await axiosPrivate.patch(
        `/api/v1/playlist/add/${videoId}/${playlistId}`
      );
      const data = response.data;
      if (data.success) {
        setIsSaved(playlistId);
        console.log(data.data);
        setOnSuccess(data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError(error.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllPlaylist();
  }, []);

  if (loading) return <h1>Loading...</h1>;

  if (onSuccess) return <h1>{onSuccess}</h1>;

  return (
    <>
      <div
        className={`playlistWrapper  ${
          openCreatePlaylist ? " closewrapper" : ""
        }`}
      >
        <UserHeader title={"Save video"} isClose={setOpenCreatePlylist} />
        {playlists &&
          playlists.length &&
          playlists.map(({ _id, name }) => {
            return (
              <div
                key={_id}
                style={{
                  display: "flex",
                  gap: "10px",
                  margin: "10px 20px",
                  fontWeight: "600",
                }}
              >
                <input
                  type="radio"
                  checked={playlistId === _id ? true : false}
                  id={_id}
                  onClick={(e) => {
                    setPlaylistId(e.target.id);
                  }}
                />
                <p className="name">{name}</p>
              </div>
            );
          })}
        {playlists.length && (
          <div>
            <button
              onClick={() => addPlaylistHandler()}
              style={{
                padding: "0.125rem 0.365rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "white",
                fontWeight: "800",
              }}
            >
              Add
            </button>
          </div>
        )}
        {!playlists.length && <EmptyPage title="No Playlist Found" />}
      </div>
      {isError && <Error message={isError} />}
      <div>
        <Model isOpen={openCreatePlaylist} isClose={setOpenCreatePlylist}>
          <CreatePlaylist setPlaylists={setPlaylists} playlists={playlists} />
        </Model>
      </div>
    </>
  );
}

export default AddVideoToPlaylist;
