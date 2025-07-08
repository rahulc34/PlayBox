import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="">Liked Videos</Link>
        </li>
        <li>
          <Link to="">History</Link>
        </li>
        <li>
          <Link to="">My Content</Link>
        </li>
        <li>
          <Link to="">Collections</Link>
        </li>
        <li>
          <Link to="">Subscribers</Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="">Support</Link>
        </li>
        <li>
          <Link to="">Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
