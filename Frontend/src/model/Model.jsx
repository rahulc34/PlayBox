import React, { useEffect } from "react";
import "../cssStyles/Model.css";

const Model = ({ isOpen, isClose, children }) => {
  if (isOpen) {
    document.body.style.overflow = "hidden"; 
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    document.body.style.overflow = "auto";
  }

  return isOpen ? (
    <>
      <div className="modelWrapper">
        <div className="model">
          {children}
          <button
            className="CloseBtn"
            onClick={() => {
              isClose();
            }}
          >
            X
          </button>
        </div>
      </div>
    </>
  ) : null;
};

export default Model;
