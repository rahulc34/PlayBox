import { ListVideo, Trash2, Lock, Globe } from "lucide-react";
import { cn } from "../lib/cn";

export default function CollectionCard({
  name,
  description,
  totalVideos,
  isPrivate,
  imageUrl,
  onClick,
  onDelete,
  showDelete,
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
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
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {isPrivate ? <Lock size={12} /> : <Globe size={12} />}
          {isPrivate ? "Private" : "Public"}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display line-clamp-1 text-base font-bold text-foreground">
          {name}
        </h3>
        <p className="mt-1 text-xs font-medium text-primary">
          {totalVideos ?? 0} video{(totalVideos ?? 0) === 1 ? "" : "s"}
        </p>
        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {showDelete && onDelete && (
        <button
          type="button"
          aria-label="Delete collection"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-red-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-red-500/10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
        >
          <Trash2 size={16} />
        </button>
      )}
    </article>
  );
}
