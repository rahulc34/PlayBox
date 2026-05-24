import { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import EmptyPage from "../../components/EmptyPage.jsx";
import CenterDiv from "../../components/CenterDiv.jsx";
import ChannelListItem from "../../components/ChannelListItem.jsx";
import PageHeader from "../../components/PageHeader.jsx";

function Subscribers({ userId }) {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState(null);

  const getSubscribers = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/v1/subscriptions/c/${userId || user._id}`
      );
      if (response.data.success) {
        setSubscribers(response.data.data || []);
      }
    } catch {
      setSubscribers([]);
    }
  };

  useEffect(() => {
    getSubscribers();
  }, [userId, user._id]);

  return (
    <div>
      <PageHeader
        title="Subscribers"
        subtitle={
          subscribers?.length
            ? `${subscribers.length} follower${subscribers.length === 1 ? "" : "s"}`
            : "People who follow this channel"
        }
      />
      {subscribers === null ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : subscribers.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {subscribers.map((sub) => (
            <ChannelListItem
              key={sub._id}
              {...sub}
              showSubscribe={user._id !== sub._id}
            />
          ))}
        </div>
      ) : (
        <CenterDiv>
          <EmptyPage
            title="No subscribers yet"
            desc="When people subscribe to your channel, they'll show up here."
          />
        </CenterDiv>
      )}
    </div>
  );
}

export default Subscribers;
