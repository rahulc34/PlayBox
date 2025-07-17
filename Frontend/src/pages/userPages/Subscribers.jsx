import React from "react";
import { axiosPrivate } from "../../api/axios.js";
import { useEffect } from "react";
import { useState } from "react";
import "../../cssStyles/Subscribe.css";
import { useAuth } from "../../contexts/AuthContext.jsx";
import EmptyPage from "../../components/EmptyPage.jsx";
import { useNavigate } from "react-router-dom";
import Subscribe from "../../components/Subscribe.jsx";

function Subscribers({ userId }) {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState("");
  const navigate = useNavigate();

  const getSubscribers = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/v1/subscriptions/c/${userId || user._id}`
      );

      const data = response.data;
      if (data.success) {
        setSubscribers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubscribers();
  }, []);

  return (
    <div className="subscribeWrapper">
      {subscribers &&
        subscribers.map(({ _id, username, fullname, avatar, isSubscribed }) => {
          console.log(username, isSubscribed);
          return (
            <div className="subscribeCard" key={_id}>
              <div
                className="profile"
                onClick={() => navigate(`/user/${username}`)}
              >
                <div className="profile-container">
                  <img src={avatar} alt="profile picture" className="profile" />
                </div>
                <div className="info">
                  <span className="info-upper">{username}</span>
                  <span className="info-lower">{fullname}</span>
                </div>
              </div>
              {user._id !== _id && isSubscribed !== undefined && (
                <Subscribe isSubscribed={isSubscribed} userId={_id} />
              )}
            </div>
          );
        })}
      {!subscribers.length && (
        <EmptyPage
          title="No subscribers"
          desc="No one has subscribed this channel"
        />
      )}
    </div>
  );
}

export default Subscribers;
