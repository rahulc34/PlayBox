import React, { useState } from "react";
import Subscribe from "../components/Subscribe.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

function Profile({
  _id,
  avatar,
  coverImage,
  fullname,
  username,
  isSubscribed,
  subscribedToCount,
  subscribersCount,
}) {
  const { user } = useAuth();
  const [totalSubscription, setTotalSubscription] = useState(subscribersCount);
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
              <p>{totalSubscription || subscribersCount} subscribers</p>
              <p>{subscribedToCount} subscribed</p>
            </span>
            {/* <span>{videosCount} videos</span> */}

            {user._id !== _id && isSubscribed !== undefined && (
              <Subscribe
                setTotalSubscription={setTotalSubscription}
                isSubscribed={isSubscribed}
                userId={_id}
              />
            )}
          </div>
        </div>
      </div>

      {user._id !== _id && isSubscribed !== undefined && (
        <Subscribe
          setTotalSubscription={setTotalSubscription}
          isSubscribed={isSubscribed}
          userId={_id}
        />
      )}
    </div>
  );
}

export default Profile;
