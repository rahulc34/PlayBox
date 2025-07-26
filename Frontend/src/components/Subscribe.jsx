import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";

function Subscribe({ setTotalSubscription, isSubscribed, userId }) {
  const [subscribed, setSubscribed] = useState(isSubscribed);

  const toggleSubscribe = async () => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/subscriptions/c/${userId}`
      );
      const data = response.data;
      if (data.success) {
        console.log(data);
        const { subscriptionCount } = data.data;
        setSubscribed(!subscribed);
        if (setTotalSubscription) setTotalSubscription(subscriptionCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      className="subscribe"
      onClick={() => {
        toggleSubscribe();
      }}
    >
      <p>{subscribed === true ? "unsubscribe" : "Subscribe"}</p>
    </button>
  );
}

export default Subscribe;
