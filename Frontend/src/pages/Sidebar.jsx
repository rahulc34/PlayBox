import React from "react";
import "../cssStyles/Sidebar.css";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToggle } from "../contexts/ToggleSidebar.jsx";

function Sidebar() {
  const { isAuthenticated } = useAuth();

  const { isToggle, setIsToggle, isToggleBtnShow, setIsToggleBtnShow } =
    useToggle();

  return (
    <>
      <div className={`sidebar-container ${isToggle && "toggleOpen"}`}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/mycontent">My Content</Link>
          </li>
          <li>
            <Link to="/history">History</Link>
          </li>
          <li>
            <Link to="/subscribers">Subscribers</Link>
          </li>
          <li>
            <Link to="/liked-video">Liked Videos</Link>
          </li>
          <li>
            <Link to="/collections">Collections</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/support">Support</Link>
          </li>
          <li>
            <Link to="/setting">Settings</Link>
          </li>
        </ul>
      </div>
      <div className="main-container">
        {isAuthenticated ? (
          <Outlet />
        ) : (
          <div>
            <h2>Please login</h2>
            <h2>No video is available</h2>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
