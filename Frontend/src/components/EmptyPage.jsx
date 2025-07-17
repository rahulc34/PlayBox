import React from "react";
import "../cssStyles/ErrorPage.css";

function EmptyPage({ title, desc }) {
  return (
    <div className="emptyPage">
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}

export default EmptyPage;
