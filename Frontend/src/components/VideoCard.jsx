import { useNavigate } from "react-router-dom";

function VideoCard({
  ownerInfo,
  thumbnail,
  title,
  views,
  duration,
  createdAt,
  _id,
}) {
  const { avatar, fullname, username } = ownerInfo || {};
  const navigate = useNavigate();

  const videoDuration =
    duration < 60
      ? Math.floor(duration) + "s"
      : duration < 60 * 60
        ? (duration / 60).toFixed(2) + "m"
        : Math.floor(duration / 3600) + "h";

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:border-primary/40 hover:shadow-[0_8px_30px_var(--glow)]"
      onClick={() => navigate(`/video/${_id}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted sm:aspect-video">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
          {videoDuration}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <h3 className="font-display line-clamp-2 text-base font-bold leading-snug text-card-foreground">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10">
            {avatar ? (
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-primary">
                {(fullname || username || "?")[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{fullname}</p>
            <p className="text-xs text-muted-foreground">
              {views} views · {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default VideoCard;
