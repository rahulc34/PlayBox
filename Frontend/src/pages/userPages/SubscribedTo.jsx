import { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import EmptyPage from "../../components/EmptyPage";
import CenterDiv from "../../components/CenterDiv";
import ChannelListItem from "../../components/ChannelListItem";
import PageHeader from "../../components/PageHeader";

function SubscribedTo({ userId }) {
  const { user } = useAuth();
  const [subscribedTo, setSubscribedTo] = useState(null);

  const getSubscriberTo = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/v1/subscriptions/u/${userId || user._id}`
      );
      if (response.data.success) {
        setSubscribedTo(response.data.data || []);
      }
    } catch {
      setSubscribedTo([]);
    }
  };

  useEffect(() => {
    getSubscriberTo();
  }, [userId, user._id]);

  return (
    <div>
      <PageHeader
        title="Subscribed to"
        subtitle={
          subscribedTo?.length
            ? `Following ${subscribedTo.length} channel${subscribedTo.length === 1 ? "" : "s"}`
            : "Channels you follow"
        }
      />
      {subscribedTo === null ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : subscribedTo.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {subscribedTo.map((channel) => (
            <ChannelListItem
              key={channel._id}
              {...channel}
              showSubscribe={user._id !== channel._id}
            />
          ))}
        </div>
      ) : (
        <CenterDiv>
          <EmptyPage
            title="Not following anyone"
            desc="Subscribe to creators to see their latest uploads in your feed."
          />
        </CenterDiv>
      )}
    </div>
  );
}

export default SubscribedTo;
