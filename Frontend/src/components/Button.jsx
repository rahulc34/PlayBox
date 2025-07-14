import React from "react";
import "../cssStyles/signUp.css";

function Button({ text, clickHandler }) {
  return (
    <button onClick={clickHandler} className="Formbtn">
      {text}
    </button>
  );
}

export default Button;
