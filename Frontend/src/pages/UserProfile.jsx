import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios.js";
import Profile from "../components/Profile.jsx";
import "../cssStyles/UserProfile.css";
import VideoList from "../components/VideoList.jsx";
import ProfileNavDetail from "../components/ProfileNavDetail.jsx";
import ProfileNavButton from "../components/ProfileNavButton.jsx";
import axios from "axios";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [state, setState] = useState("videos");
  console.log(username);
  const getUserProfile = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/users/C/${username}`);
      const data = response.data;
      if (data.success) {
        setUser(data.data);
        setUserId(data.data?._id);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useState(() => {
    console.log("getting the data");
    getUserProfile();
    console.log("got data");
  }, [username]);

  return (
    <div>
      <Profile {...user} />
      <ProfileNavButton state={state} setState={setState} />
      <div>
        <ProfileNavDetail state={state} userId={userId} />
      </div>
    </div>
  );
}

export default UserProfile;
