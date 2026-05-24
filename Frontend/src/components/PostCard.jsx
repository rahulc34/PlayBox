import { ThumbsUp, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";
import UserAvatar from "./UserAvatar";

export default function PostCard({
  content,
  createdAt,
  username,
  avatar,
  likes,
  likedby,
  isOwner,
  onLike,
  onDelete,
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex gap-3">
        <UserAvatar src={avatar} name={username} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">
              @{username}
            </span>
            <time className="text-xs text-muted-foreground">
              {new Date(createdAt).toLocaleString()}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {content}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onLike}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                likedby
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <ThumbsUp size={14} className={likedby ? "fill-current" : ""} />
              {likes || 0}
            </button>
            {isOwner && (
              <button
                type="button"
                onClick={onDelete}
                aria-label="Delete post"
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-500/10"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
