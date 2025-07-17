import React from "react";

function UserHeader({ count, title }) {
  return (
    <div className="playlist-header">
      <p className="name">{count} {title}</p>
      <button>create</button>
    </div>
  );
}

export default UserHeader;
