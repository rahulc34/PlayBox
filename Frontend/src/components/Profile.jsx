import Subscribe from "./Subscribe.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import UserAvatar from "./UserAvatar";
import { formatUsername } from "../lib/format";

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
  user: userDetail,
}) {
  const { user } = useAuth();
  const isOwnProfile = user?._id === _id;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative h-32 bg-gradient-to-br from-primary/30 to-accent/10 sm:h-40">
        {coverImage && (
          <img
            src={coverImage}
            alt=""
            className="h-full w-full object-cover opacity-90"
          />
        )}
      </div>
      <div className="relative px-4 pb-6 sm:px-6">
        <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="rounded-full ring-4 ring-card">
              <UserAvatar src={avatar} name={fullname || username} size="2xl" />
            </div>
            <div className="pb-1">
              <h1 className="font-display text-xl font-bold text-foreground">
                {formatUsername(username)}
              </h1>
              <p className="text-muted-foreground">{fullname}</p>
            </div>
          </div>
          {!isOwnProfile && _id && (
            <Subscribe
              isSubscribed={isSubscribed}
              userId={_id}
              setTotalSubscription={(count) =>
                setUser({ ...userDetail, subscribersCount: count })
              }
            />
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{subscribersCount ?? 0}</strong>{" "}
            subscribers
          </span>
          <span>
            <strong className="text-foreground">{subscribedToCount ?? 0}</strong>{" "}
            subscribed
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
