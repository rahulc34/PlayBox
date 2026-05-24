import { ChevronDown, ChevronUp, ThumbsUp, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";
import UserAvatar from "./UserAvatar";

export default function CommentItem({
  username,
  avatar,
  content,
  createdAt,
  likes,
  likedby,
  isOwner,
  replyCount,
  showReplies,
  onToggleReplies,
  onLike,
  onDelete,
  children,
  isReply = false,
}) {
  return (
    <div
      className={cn(
        "flex gap-3 py-4",
        isReply && "ml-4 border-l-2 border-border pl-4 sm:ml-8",
        !isReply && "border-b border-border last:border-0"
      )}
    >
      <UserAvatar src={avatar} name={username} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">
            @{username}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-foreground">{content}</p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onLike}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition",
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
              aria-label="Delete comment"
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
            >
              <Trash2 size={14} />
            </button>
          )}

          {!isReply && replyCount !== undefined && onToggleReplies && (
            <button
              type="button"
              onClick={onToggleReplies}
              className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              {replyCount} {replyCount === 1 ? "reply" : "replies"}
              {showReplies ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
          )}
        </div>

        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}
