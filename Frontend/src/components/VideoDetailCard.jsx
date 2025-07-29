import React, { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios.js";
import LikeBtn from "./LikeBtn.jsx";
import Subscribe from "./Subscribe.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import Model from "../model/Model.jsx";
import AddVideoToPlaylist from "./AddVideoToPlaylist.jsx";
import CommentList from "./CommentList.jsx";

const VideoDetailCard = ({ video, setVideo }) => {
  const {
    _id: videoId,
    owner,
    videoFile,
    title,
    description,
    views,
    // likes,
    // likedby,
    PlaylistId: alreadySaved,
    createdAt,
  } = video;
  const {
    _id: userId,
    username,
    fullname,
    avatar,
    subscribersCount,
    isSubscribed,
  } = owner || {};

  const navigate = useNavigate();
  const [readMore, setReadMore] = useState(false);
  const [totalSubscription, setTotalSubscription] = useState(subscribersCount);
  const [addOpenPlaylist, setAddOpenPlaylist] = useState(false);
  const [isSaved, setIsSaved] = useState(alreadySaved || false);
  const { user } = useAuth();

  const removeVideoFromPlaylist = async () => {
    try {
      const respone = await axiosPrivate.patch(
        `/api/v1/playlist/remove/${videoId}/${isSaved}`
      );

      if (respone.data.success) {
        setIsSaved("");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    setIsSaved(alreadySaved || false);
    setTotalSubscription(subscribersCount);
  }, [video]);

  return (
    <>
      <div className="videoWrapper">
        <video key={videoId} width="320px" controls>
          <source src={videoFile} />
        </video>
      </div>
      <div className="videoDetail">
        <div className="upper-detail">
          <div className="info">
            <span className="title">{title}</span>
            <p>
              <span>{views} views.</span>
              <span> {new Date(createdAt).toLocaleDateString()}</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: "3px" }}>
            {videoId && <LikeBtn setVideo={setVideo} video={video} />}
            <button
              className="like"
              onClick={() => {
                if (isSaved) removeVideoFromPlaylist();
                else setAddOpenPlaylist(true);
              }}
            >
              {isSaved ? "Saved" : "save"}
            </button>
          </div>
        </div>
        <div className="lower-detail">
          <div
            className="profile"
            onClick={() => navigate(`/user/${username}`)}
          >
            <div className="profile-container">
              <img src={avatar} alt="profile picture" className="profile" />
            </div>
            <span className="userinfo">
              <p className="username">{fullname}</p>
              <p className="subscribers">{totalSubscription} Subscribers</p>
            </span>
          </div>
          {userId !== user._id && (
            <Subscribe
              isSubscribed={isSubscribed}
              setTotalSubscription={setTotalSubscription}
              userId={userId}
            />
          )}
        </div>
        <p className={"description " + (readMore ? "activeRead" : "")}>
          Description: {description}
          <span className="moreBtn" onClick={() => setReadMore(!readMore)}>
            more
          </span>
        </p>
        <div>
          <CommentList videoId={videoId} />
        </div>
      </div>
      <Model isOpen={addOpenPlaylist} isClose={setAddOpenPlaylist}>
        <AddVideoToPlaylist
          videoId={videoId}
          setIsSaved={setIsSaved}
          setIsClosePlaylistAdd={setAddOpenPlaylist}
          video={video}
          setVideo={setVideo}
        />
      </Model>
    </>
  );
};

export default VideoDetailCard;
