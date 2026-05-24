import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { cn } from "../lib/cn";

function Subscribe({ setTotalSubscription, isSubscribed, userId }) {
  const [subscribed, setSubscribed] = useState(isSubscribed);

  useEffect(() => {
    setSubscribed(isSubscribed);
  }, [isSubscribed]);

  const toggleSubscribe = async () => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/subscriptions/c/${userId}`
      );
      const data = response.data;
      if (data.success) {
        const { subscriptionCount } = data.data;
        setSubscribed(!subscribed);
        if (setTotalSubscription) setTotalSubscription(subscriptionCount);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSubscribe}
      className={cn(
        "rounded-full px-5 py-2.5 text-sm font-semibold transition",
        subscribed
          ? "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
          : "bg-violet-600 text-white shadow-md shadow-violet-600/25 hover:bg-violet-700"
      )}
    >
      {subscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}

export default Subscribe;
