import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios.js";
import LikeBtn from "./LikeBtn.jsx";
import Subscribe from "./Subscribe.jsx";
import { Navigate } from "react-router-dom";

const VideoDetailCard = ({
  _id,
  owner,
  videoFile,
  thumbnail,
  title,
  description,
  duration,
  views,
  isPublished,
  createdAt,
}) => {
  const {
    _id: userId,
    username,
    fullname,
    avatar,
    subscribersCount,
    isSubscibed,
  } = owner || {};

  const navigate = useNavigate();

  return (
    <>
      <div className="videoWrapper">
        <video key={_id} width="320px" controls>
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
          <LikeBtn likes="0" />
        </div>
        <div className="lower-detail">
          <div className="profile" onClick={() => navigate(`/user/${userId}`)}>
            <div className="profile-container">
              <img src={avatar} alt="profile picture" className="profile" />
            </div>
            <span className="userinfo">
              <p className="username">{fullname}</p>
              <p className="subscribers">{subscribersCount} Subscribers</p>
            </span>
          </div>
          <Subscribe isSubscibed />
        </div>
        <p className="description">Description: {description}</p>
      </div>
    </>
  );
};

export default VideoDetailCard;
