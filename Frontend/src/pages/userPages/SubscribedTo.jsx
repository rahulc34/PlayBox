import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import EmptyPage from "../../components/EmptyPage";
import Subscribe from "../../components/Subscribe";
import CenterDiv from "../../components/CenterDiv";

function SubscribedTo({ userId }) {
  const { user } = useAuth();
  const [subscribedTo, setSubscribedTo] = useState("");
  const navigate = useNavigate();

  const getSubscriberTo = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/v1/subscriptions/u/${userId || user._id}`
      );
      const data = response.data;
      if (data.success) {
        setSubscribedTo(data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getSubscriberTo();
  }, []);

  return (
    <div className="subscribeWrapper">
      {subscribedTo && subscribedTo.length
        ? subscribedTo.map(
            ({ _id, username, fullname, avatar, isSubscribed }) => {
              return (
                <div className="subscribeCard" key={_id}>
                  <div
                    className="profile"
                    onClick={() => navigate(`/user/${username}`)}
                  >
                    <div className="profile-container">
                      {avatar && (
                        <img
                          src={avatar}
                          alt="profile picture"
                          className="profile"
                        />
                      )}
                    </div>
                    <div className="info">
                      <span className="info-upper">{username}</span>
                      <span className="info-lower">{fullname}</span>
                    </div>
                  </div>
                  {user._id !== _id && isSubscribed !== undefined && (
                    <Subscribe userId={_id} isSubscribed={isSubscribed} />
                  )}
                </div>
              );
            }
          )
        : ""}
      {!subscribedTo.length && (
        <CenterDiv>
          <EmptyPage
            title="No subscribed to"
            desc="You have not subscribed to any channel"
          />
        </CenterDiv>
      )}
    </div>
  );
}

export default SubscribedTo;
