import React, { useState } from "react";
import Subscribe from "../components/Subscribe.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { axiosPrivate } from "../api/axios.js";

function Profile({
  _id,
  avatar,
  coverImage,
  fullname,
  username,
  isSubscribed,
  subscribedToCount,
  subscribersCount,
  setUser,
  user : userDetail,
}) {
  const { user } = useAuth();

  const toggleSubscribe = async () => {
    try {
      console.log("tirg");
      const response = await axiosPrivate.post(
        `/api/v1/subscriptions/c/${_id}`
      );
      const data = response.data;
      if (data.success) {
        console.log(data);
        const { subscriptionCount } = data.data;
        const newUser = {
          ...userDetail,
          isSubscribed: !isSubscribed,
          subscribersCount: subscriptionCount,
        };
        console.log("newuser", newUser);
        setUser(newUser);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("profile data", isSubscribed);
  return (
    <div className="profileContainer">
      <div className="bannerWrapper">
        <img src={coverImage} alt="banner Image" />
      </div>
      <div className="profileDetailwrapper">
        <div className="UserProfileDetailAvatar">
          <img src={avatar} alt="" className="avatarImg" />
        </div>
        <div className="profileDetail">
          <p className="username">{username}</p>
          <span className="fullname">{fullname}</span>
          <div className="subscribeInfo">
            <span>
              <p>{subscribersCount} subscribers</p>
              <p>{subscribedToCount} subscribed</p>
            </span>
            {/* <span>{videosCount} videos</span> */}
            {user._id !== _id && isSubscribed !== undefined && (
              <button className="subscribe" onClick={toggleSubscribe}>
                {isSubscribed === true ? "unsubscribe" : "Subscribe"}
              </button>
            )}
          </div>
        </div>
      </div>

      {user._id !== _id && isSubscribed !== undefined && (
        <button className="subscribe" onClick={toggleSubscribe}>
          {isSubscribed === true ? "unsubscribe" : "Subscribe"}
        </button>
      )}
    </div>
  );
}

export default Profile;
