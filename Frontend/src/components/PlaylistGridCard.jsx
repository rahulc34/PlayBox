import { ListVideo, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

export default function PlaylistGridCard({
  name,
  description,
  totalVideos,
  imageUrl,
  onClick,
  onDelete,
  showDelete,
}) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick(e) : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ListVideo size={40} strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
          {totalVideos ?? 0} videos
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display line-clamp-1 font-bold text-foreground">{name}</h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {showDelete && onDelete && (
        <button
          type="button"
          id="deleteBtn"
          aria-label="Delete playlist"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-red-500 opacity-0 shadow-sm transition hover:bg-red-500/10 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      )}
    </article>
  );
}
