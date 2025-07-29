import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import VideoCard from "./VideoCard.jsx";
import EmptyPage from "./EmptyPage.jsx";
import "../cssStyles/playlistDetail.css";
import { useAuth } from "../contexts/AuthContext.jsx";
import Model from "../model/Model.jsx";
import CreatePlaylist from "../model/CreatePlaylist.jsx";

function PlaylistDetail() {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const [videos, setVideos] = useState("");
  const [playlistDetail, setPlaylistDetail] = useState("");
  const [isOpen, isClose] = useState(false);

  const getPlaylistDetail = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/playlist/${playlistId}`);
      const data = response.data;
      if (data.success) {
        const { _id, name, description, videos, isPrivate, owner } = data.data;
        setPlaylistDetail({
          _id,
          name,
          description,
          isPrivate,
          imageUrl: videos?.[0]?.thumbnail,
          owner,
        });
        setVideos(videos);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getPlaylistDetail();
  }, []);

  // console.log(playlistDetail);
  return (
    <>
      <div>
        <div className="backdropimage">
          <div className="videoWrapper playlistThumbnail">
            <img
              src={playlistDetail?.imageUrl}
              style={{ width: "100%", height: "100%" }}
              alt="playlist"
            />
          </div>
          <div className="playlistDetail">
            <p className="name">{playlistDetail.name}</p>
            <div className="createdBY">
              <div className="profile-container">
                <img
                  src={playlistDetail.owner?.avatar}
                  alt=""
                  className="profile"
                />
              </div>
              <span>by {playlistDetail.owner?.username}</span>
            </div>
            <p style={{ position: "relative" }}>
              <span>Playlist . </span>
              {playlistDetail.isPrivate ? "Private . " : "Public . "}
              <span> {videos.length} Videos</span>
              {playlistDetail.owner?._id === user._id && (
                <button
                  className="editBtn"
                  onClick={() => {
                    isClose(true);
                  }}
                >
                  Edit
                </button>
              )}
            </p>
            <p>{playlistDetail.description}</p>
          </div>
        </div>
        <div className="grid-container">
          {videos.length &&
            videos.map((video) => <VideoCard {...video} key={video._id} />)}
          {!videos.length && (
            <EmptyPage title="No Video found" desc="this playlist is empty" />
          )}
        </div>
      </div>
      <Model isOpen={isOpen} isClose={isClose}>
        <CreatePlaylist
          title={playlistDetail.name}
          playlistId={playlistId}
          description={playlistDetail.description}
          state={"edit"}
          isPrivate={playlistDetail.isPrivate}
          setPlaylistDetail={setPlaylistDetail}
          playlistDetail={playlistDetail}
        />
      </Model>
    </>
  );
}

export default PlaylistDetail;
