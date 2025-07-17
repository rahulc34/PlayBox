import React from "react";

function ProfileNavButton({ state, setState }) {
  function SelectedButton(selectedBtn) {
    return state === selectedBtn ? "active" : "";
  }

  function btnClickHandler(selectedBtn) {
    setState(selectedBtn);
  }

  return (
    <ul className="userProfileNav">
      <li
        className={SelectedButton("videos")}
        onClick={() => btnClickHandler("videos")}
      >
        Videos
      </li>
      <li
        className={SelectedButton("playlists")}
        onClick={() => btnClickHandler("playlists")}
      >
        Playlists
      </li>
      <li
        className={SelectedButton("posts")}
        onClick={() => btnClickHandler("posts")}
      >
        Posts
      </li>
      <li
        className={SelectedButton("subscribers")}
        onClick={() => btnClickHandler("subscribers")}
      >
        Subscribers
      </li>
      <li
        className={SelectedButton("suscribedTo")}
        onClick={() => btnClickHandler("suscribedTo")}
      >
        Suscribed To
      </li>
    </ul>
  );
}

export default ProfileNavButton;
