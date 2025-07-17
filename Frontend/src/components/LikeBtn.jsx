import React from "react";

const LikeBtn = ({ likes }) => {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      <button className="like">
        <p>{likes}</p>
        <img src="./dsfjk" />
      </button>
      <button className="like">Save</button>
    </div>
  );
};

export default LikeBtn;
