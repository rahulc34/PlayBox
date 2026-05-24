import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import Subscribe from "./Subscribe";

export default function ChannelListItem({
  _id,
  username,
  fullname,
  avatar,
  isSubscribed,
  showSubscribe,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        onClick={() => navigate(`/user/${username}`)}
      >
        <UserAvatar src={avatar} name={fullname || username} size="lg" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">@{username}</p>
          <p className="truncate text-sm text-muted-foreground">{fullname}</p>
        </div>
      </button>
      {showSubscribe && (
        <div className="shrink-0 sm:ml-4">
          <Subscribe isSubscribed={isSubscribed} userId={_id} />
        </div>
      )}
    </div>
  );
}
