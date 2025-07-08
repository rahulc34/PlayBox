import React from "react";

function Button({ text, clickHandler }) {
  return <button onClick={clickHandler}>{text}</button>;
}

export default Button;
