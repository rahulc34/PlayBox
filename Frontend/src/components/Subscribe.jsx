import React from "react";

function Subscribe({ isSubscibed }) {
  return (
    <button className="subscribe">
      <p>{isSubscibed ? "unsubscribe" : "Subscribe"}</p>
    </button>
  );
}

export default Subscribe;
