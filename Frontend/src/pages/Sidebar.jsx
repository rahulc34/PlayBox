import React from "react";
import "../cssStyles/Sidebar.css";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToggle } from "../contexts/ToggleSidebar.jsx";
import PlaylistCard from "../components/PlaylistCard.jsx";
import homeIcon from "../assests/home.png";
import dashBoardIcon from "../assests/dashboard.png";
import videosIcon from "../assests/videos.png";
import historyIcon from "../assests/history.png";
import subscriberIcon from "../assests/subscribers.png";
import subscribeToIcon from "../assests/subscribe.png";
import likedVideoIcon from "../assests/likedVideo.png";
import playlistIcon from "../assests/playlist.png";
import supportIcon from "../assests/support.png";
import settingIcon from "../assests/setting.png";
import CenterDiv from "../components/CenterDiv.jsx";

function Sidebar() {
  const { user, isAuthenticated, loading, verifyEmailRes } = useAuth();
  const { isVerified } = user || {};
  const { isToggle, setIsToggle, isToggleBtnShow, setIsToggleBtnShow } =
    useToggle();

  return (
    <>
      <div className={`sidebar-container ${isToggle && "toggleOpen"}`}>
        <ul>
          <Link to="/">
            <li onClick={() => setIsToggle(false)}>
              <img src={homeIcon} alt="" width="20px" />
              Home
            </li>
          </Link>
          <Link to="/dashboard">
            <li onClick={() => setIsToggle(false)}>
              <img src={dashBoardIcon} alt="" width="18px" />
              Dashboard
            </li>
          </Link>
          <Link to="/mycontent">
            <li onClick={() => setIsToggle(false)}>
              <img src={videosIcon} alt="" width="22px" />
              My content
            </li>
          </Link>
          <Link to="/history">
            <li onClick={() => setIsToggle(false)}>
              <img src={historyIcon} alt="" width="22px" />
              History
            </li>
          </Link>
          <Link to="/subscribers">
            <li onClick={() => setIsToggle(false)}>
              <img src={subscriberIcon} alt="" width="22px" />
              Subscribers
            </li>
          </Link>
          <Link to="/subscribedTo">
            <li onClick={() => setIsToggle(false)}>
              <img src={subscribeToIcon} alt="" width="25px" />
              Subscribed To
            </li>
          </Link>
          <Link to="/liked-video">
            <li onClick={() => setIsToggle(false)}>
              <img src={likedVideoIcon} alt="" width="22px" />
              Liked Videos
            </li>
          </Link>
          <Link to="/collections">
            <li onClick={() => setIsToggle(false)}>
              <img src={playlistIcon} alt="" width="20px" />
              Collections
            </li>
          </Link>
        </ul>
        <ul>
          <Link to="/support">
            <li onClick={() => setIsToggle(false)}>
              <img src={supportIcon} alt="" width="22px" />
              Support
            </li>
          </Link>
          <Link to="/setting">
            <li onClick={() => setIsToggle(false)}>
              <img src={settingIcon} alt="" width="22px" />
              Setting
            </li>
          </Link>
          {/* <li className="logoutbtn">
            <Link to="/setting">Logout</Link>
          </li> */}
        </ul>
      </div>
      <div className="main-container">
        {isAuthenticated && isVerified ? (
          <Outlet />
        ) : !isAuthenticated ? (
          <CenterDiv>
            <div>
              <h2>Please login</h2>
              <h2>No video is available</h2>
            </div>
          </CenterDiv>
        ) : (
          <CenterDiv>
            <div>
              {loading && <h1>loading...</h1>}
              {verifyEmailRes && <h2>{verifyEmailRes}</h2>}
              {!loading && !verifyEmailRes && <h2>Please verify Email</h2>}
            </div>
          </CenterDiv>
        )}
      </div>
    </>
  );
}

export default Sidebar;
