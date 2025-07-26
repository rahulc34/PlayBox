import React, { useEffect, useId, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import EmptyPage from "./EmptyPage";
import UserHeader from "./UserHeader";
import { useAuth } from "../contexts/AuthContext";
import Model from "../model/Model.jsx";
import CreatePlaylist from "../model/CreatePlaylist.jsx";
import { DeletePlaylist } from "../model/deletePlaylist.jsx";
import CenterDiv from "./CenterDiv.jsx";

function PlaylistCard({ userId }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState("");
  const [state, setstate] = useState("");
  const [playlistDeleteId, setplaylistDeleteId] = useState("");

  const navigate = useNavigate();

  const [isOpen, isClose] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
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
        <UserHeader
          title="Playlist"
          count={playlists.length}
          isClose={isClose}
        />
      )}
      <div className="plylistwrapper">
        {playlists && playlists.length
          ? playlists.map(
              ({
                _id,
                name,
                description,
                totalVideos,
                createdAt,
                imageUrl,
              }) => {
                return (
                  <div
                    onClick={(e) => {
                      console.log(e.target);
                      if (e.target.id === "deleteBtn") {
                        setIsOpenDelete(true);
                        setplaylistDeleteId(_id);
                      } else navigate(`/playlist/${_id}`);
                    }}
                    key={_id}
                    className="playlistcontain"
                  >
                    <div className="playlist-content">
                      <p className="name">{name}</p>
                      <p className="count">{totalVideos} videos</p>
                      <p className="description">{description}</p>
                      {userId === user._id && (
                        <button className="editBtn" id="deleteBtn">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
            )
          : ""}
        {!playlists.length && (
          <CenterDiv>
            <EmptyPage
              title="No Playlist Found"
              desc="This channel yet have to make a playlist"
            />
          </CenterDiv>
        )}
      </div>
      <Model isOpen={isOpen} isClose={isClose}>
        <CreatePlaylist setPlaylists={setPlaylists} playlists={playlists} />
      </Model>
      <Model isOpen={isOpenDelete} isClose={setIsOpenDelete}>
        <DeletePlaylist
          playlistId={playlistDeleteId}
          setPlaylists={setPlaylists}
          playlists={playlists}
        />
      </Model>
    </>
  );
}

export default PlaylistCard;
