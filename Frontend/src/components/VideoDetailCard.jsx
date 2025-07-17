import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios.js";
import LikeBtn from "./LikeBtn.jsx";
import Subscribe from "./Subscribe.jsx";
import { Navigate } from "react-router-dom";
import Save from "./Save.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const VideoDetailCard = ({
  _id: videoId,
  owner,
  videoFile,
  thumbnail,
  title,
  description,
  duration,
  views,
  likes,
  isPublished,
  createdAt,
}) => {
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
  const { user } = useAuth();
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
              <span>{createdAt}</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: "3px" }}>
            {videoId && <LikeBtn likes={likes} videoId={videoId} />}
            <button className="like">Save</button>
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
      </div>
    </>
  );
};

export default VideoDetailCard;
