import React, { useEffect, useId, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import EmptyPage from "./EmptyPage";
import UserHeader from "./UserHeader";
import { useAuth } from "../contexts/AuthContext";

function PlaylistCard({ userId }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState("");
  const navigate = useNavigate();

  const getAllPlaylist = async () => {
    try {
      const respose = await axiosPrivate.get(`/api/v1/playlist/user/${userId}`);

      const data = respose.data;
      if (data.success) {
        setPlaylists(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPlaylist();
  }, []);

  return (
    <>
      {userId === user._id && (
        <UserHeader title="Playlist" count={playlists.length} />
      )}
      <div className="plylistwrapper">
        {playlists &&
          playlists.map(
            ({ name, description, totalVideos, _id, createdAt, imageUrl }) => {
              return (
                <div
                  onClick={() => {
                    navigate(`/playlist/${_id}`);
                  }}
                  key={_id}
                  className="playlistcontain"
                >
                  <div className="playlist-content">
                    <p className="name">{name}</p>
                    <p className="count">{totalVideos} videos</p>
                    <p className="description">{description}</p>
                    {userId === user._id && (
                      <button className="editBtn">Delete</button>
                    )}
                  </div>
                </div>
              );
            }
          )}
        {!playlists.length && (
          <EmptyPage
            title="No Playlist Found"
            desc="This channel yet have to make a playlist"
          />
        )}
      </div>
    </>
  );
}

export default PlaylistCard;
