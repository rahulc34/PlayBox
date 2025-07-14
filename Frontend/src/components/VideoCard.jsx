import React from "react";
import "../cssStyles/VideoCard.css";
import { Navigate, useNavigate } from "react-router-dom";

function VideoCard({
  ownerInfo,
  thumbnail,
  title,
  videoFile,
  views,
  isPublished,
  duration,
  description,
  createdAt,
  _id,
}) {
  const { avatar, fullname, username } = ownerInfo || {};
  // console.log("fetc");
  // console.log(thumbnail, title, videoFile, views);
  const navigate = useNavigate();
  const getVideo = () => {
    navigate(`/video/${_id}`);
  };

  return (
    <div className="video-container" onClick={getVideo}>
      <div className="video-thumbnail">
        <img src={thumbnail} alt="thumbnail" className="thumbnail" />
        <span>{duration}</span>
      </div>
      <div className="video-bottom">
        <div className="profile-container">
          <img src={avatar} alt="profile picture" className="profile" />
        </div>
        <div className="info">
          <span className="info-upper">{title}</span>
          <span className="info-lower">
            <p className="fullname">{fullname}</p>
            <p>
              <span>{views} views. </span>
              <span>1 month ago</span>
            </p>
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
