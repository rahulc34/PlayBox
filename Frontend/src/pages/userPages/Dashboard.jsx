import React, { useEffect, useState } from "react";
import UserHeader from "../../components/UserHeader";
import { useAuth } from "../../contexts/AuthContext";
import { axiosPrivate } from "../../api/axios";
import "../../cssStyles/DashboardStyle.css";
import { useNavigate } from "react-router-dom";
import Model from "../../model/Model";
import VideoModel from "../../model/VideoModel";
import { DeletePlaylist } from "../../model/deletePlaylist.jsx";
import UpdateProfile from "../../model/UpdateProfile.jsx";

function Dashboard() {
  const { user } = useAuth();
  const [channelStatus, setChannelStatus] = useState("");
  const [channelVideos, setChannelVideos] = useState("");
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [uploadVideo, setUploadVideo] = useState(false);
  const [isEditVideo, setIsEditVideo] = useState(false);
  const [editVideo, setEditVideo] = useState("");
  const [deleteVideo, setDeleteVideo] = useState(false);
  const [videoId, setVideoId] = useState("");

  const navigate = useNavigate();

  const getChannelStatus = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/dashboard/stats");
      // console.log(response.data.data);
      const data = response.data;
      if (data.success) {
        setChannelStatus(data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const getChannelVideos = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/dashboard/videos");
      const data = response.data;

      if (data.success) {
        // console.log(data);
        setChannelVideos(data.data.videos);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getChannelStatus();
    getChannelVideos();
  }, []);

  return (
    <>
      <div className="dashboard">
        <UserHeader title="Welcome Back" isClose={setUploadVideo} />
        <div className="profileContainer">
          <div className="bannerWrapper">
            <img src={user?.coverImage} alt="banner Image" />
          </div>
          <div className="profileDetailwrapper">
            <div className="UserProfileDetailAvatar">
              <img src={user.avatar} alt="" className="avatarImg" />
            </div>
            <div className="profileDetail">
              <p className="username">{user.username}</p>
              <p>{user.fullname}</p>
              <button
                style={{
                  border: "1px solid red",
                  color: "red",
                  padding: "0.125rem 0.365rem",
                  fontWeight: "600",
                  borderRadius: "0.3rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsProfileEdit(true);
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid-container">
          <div className="status-container">
            <span>Views</span>
            <span className="main">{channelStatus?.totalViews || 0}</span>
          </div>
          <div className="status-container">
            <span>Subscribers</span>
            <span className="main">{channelStatus?.totalSubscribers || 0}</span>
          </div>
          <div className="status-container">
            <span>Likes</span>
            <span className="main">{channelStatus?.totalLikes || 0}</span>
          </div>
          <div className="status-container">
            <span>Total Videos</span>
            <span className="main">{channelStatus?.totalVideos || 0}</span>
          </div>
        </div>

        <div className="dashboardVideos">
          <table className="tableStyle">
            <thead>
              <tr>
                <th>Status</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Rating</th>
                <th>Date Uploaded</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {channelVideos &&
                channelVideos.map((video) => {
                  const {
                    _id,
                    thumbnail,
                    title,
                    views,
                    isPublished,
                    likes,
                    createdAt,
                  } = video;

                  const dateObj = new Date(createdAt);
                  const date = dateObj.toLocaleDateString();
                  const time = dateObj.toLocaleTimeString();
                  return (
                    <tr key={_id}>
                      <td>
                        <span
                          onClick={(e) => {
                            // console.log(e.target);
                          }}
                        >
                          <input type="radio" checked={isPublished} />
                        </span>
                      </td>
                      <td>
                        <p
                          className={
                            isPublished
                              ? "publishedtext public"
                              : "publishedtext private"
                          }
                        >
                          {isPublished ? "published" : "Unpublished"}
                        </p>
                      </td>
                      <td>
                        <div
                          className="container"
                          onClick={() => {
                            navigate(`/video/${_id}`);
                          }}
                        >
                          <div className="profile-container">
                            <img
                              src={thumbnail}
                              alt="thumbnail"
                              className="profile"
                            />
                          </div>
                          <p>{title}</p>
                        </div>
                      </td>
                      <td>
                        <div className="container">
                          <p className="likesbtn">
                            <span>{likes || 0}</span> likes
                          </p>
                          <p className="viewsbtn">
                            <span>{views || 0}</span> views
                          </p>
                        </div>
                      </td>
                      <td>{date + " " + time}</td>
                      <td className="editbtn">
                        <div className="container">
                          <button
                            onClick={() => {
                              setVideoId(_id);
                              setDeleteVideo(true);
                            }}
                            style={{
                              width: "22px",
                              backgroundColor: "inherit",
                              border: "0",
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="#ffffff"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                stroke="#ffffff"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path
                                  d="M10 11V17"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                                <path
                                  d="M14 11V17"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                                <path
                                  d="M4 7H20"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                                <path
                                  d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                                <path
                                  d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                              </g>
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setEditVideo(video);
                              setIsEditVideo(true);
                            }}
                            style={{
                              width: "20px",
                              backgroundColor: "inherit",
                              border: "0",
                            }}
                          >
                            <svg
                              fill="#ffffff"
                              viewBox="0 0 32 32"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="#ffffff"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth-="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path d="M30.133 1.552c-1.090-1.044-2.291-1.573-3.574-1.573-2.006 0-3.47 1.296-3.87 1.693-0.564 0.558-19.786 19.788-19.786 19.788-0.126 0.126-0.217 0.284-0.264 0.456-0.433 1.602-2.605 8.71-2.627 8.782-0.112 0.364-0.012 0.761 0.256 1.029 0.193 0.192 0.45 0.295 0.713 0.295 0.104 0 0.208-0.016 0.31-0.049 0.073-0.024 7.41-2.395 8.618-2.756 0.159-0.048 0.305-0.134 0.423-0.251 0.763-0.754 18.691-18.483 19.881-19.712 1.231-1.268 1.843-2.59 1.819-3.925-0.025-1.319-0.664-2.589-1.901-3.776zM22.37 4.87c0.509 0.123 1.711 0.527 2.938 1.765 1.24 1.251 1.575 2.681 1.638 3.007-3.932 3.912-12.983 12.867-16.551 16.396-0.329-0.767-0.862-1.692-1.719-2.555-1.046-1.054-2.111-1.649-2.932-1.984 3.531-3.532 12.753-12.757 16.625-16.628zM4.387 23.186c0.55 0.146 1.691 0.57 2.854 1.742 0.896 0.904 1.319 1.9 1.509 2.508-1.39 0.447-4.434 1.497-6.367 2.121 0.573-1.886 1.541-4.822 2.004-6.371zM28.763 7.824c-0.041 0.042-0.109 0.11-0.19 0.192-0.316-0.814-0.87-1.86-1.831-2.828-0.981-0.989-1.976-1.572-2.773-1.917 0.068-0.067 0.12-0.12 0.141-0.14 0.114-0.113 1.153-1.106 2.447-1.106 0.745 0 1.477 0.34 2.175 1.010 0.828 0.795 1.256 1.579 1.27 2.331 0.014 0.768-0.404 1.595-1.24 2.458z"></path>{" "}
                              </g>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <Model isOpen={uploadVideo} isClose={setUploadVideo}>
        <VideoModel />
      </Model>
      <Model isOpen={deleteVideo} isClose={setDeleteVideo}>
        <DeletePlaylist
          deleteVideoId={videoId}
          setChannelVideo={channelVideos}
          state={"deleteVideo"}
        />
      </Model>
      <Model isOpen={isEditVideo} isClose={setIsEditVideo}>
        <VideoModel
          state={"editVideo"}
          video={editVideo}
          setChannelVideo={setChannelVideos}
        />
      </Model>
      <Model isOpen={isProfileEdit} isClose={setIsProfileEdit}>
        <UpdateProfile channel={channelStatus} setChannel={setChannelStatus} />
      </Model>
    </>
  );
}

export default Dashboard;
