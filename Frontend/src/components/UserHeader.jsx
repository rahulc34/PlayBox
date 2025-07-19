import React from "react";

function UserHeader({ count, title, isClose }) {
  return (
    <div className="playlist-header">
      <p className="name">
        {count} {title}
      </p>
      <button onClick={isClose}>create</button>
    </div>
  );
}

export default UserHeader;
