import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import PostCreate from "./PostCreate";
import { axiosPrivate } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import CommentReply from "./CommentReply";
import Pagination from "./Pagination";
import CommentItem from "./CommentItem";
import { cn } from "../lib/cn";

function CommentList({ videoId }) {
  const { user } = useAuth();
  const [comment, setComment] = useState([]);
  const [replyShowIds, setReplyShowIds] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [showComment, setShowComment] = useState(true);

  const toggleReplyVisibility = (commentId) => {
    setReplyShowIds((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const getComment = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/v1/comments/${videoId}?page=${page}`
      );
      const data = response.data;
      if (data.success) {
        const { page: p, total } = data.data;
        setPage(p);
        setTotalPage(total / 10 + (total % 10 !== 0 ? 1 : 0));
        setComment(data.data?.comments || []);
      }
    } catch {
      /* ignore */
    }
  };

  const toggleCommentLike = async (commentId) => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/likes/toggle/c/${commentId}`
      );
      if (response.data.success) {
        const { likes } = response.data.data || {};
        setComment((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, likedby: !c.likedby, likes }
              : c
          )
        );
      }
    } catch {
      /* ignore */
    }
  };

  const createComment = async (content) => {
    try {
      const response = await axiosPrivate.post(`/api/v1/comments/${videoId}`, {
        content,
      });
      if (response.data.success) {
        const newComment = response.data?.data;
        const { avatar, username } = user;
        setComment([
          {
            ...newComment,
            likedby: false,
            likes: 0,
            reply: 0,
            avatar,
            username,
            owner: user._id,
          },
          ...comment,
        ]);
      }
    } catch {
      /* ignore */
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axiosPrivate.delete(
        `/api/v1/comments/c/${commentId}`
      );
      if (response.data.success) {
        setComment((prev) => prev.filter((com) => com._id !== commentId));
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    getComment();
  }, [videoId, page]);

  return (
    <section className="mt-6">
      <PostCreate submitHandler={createComment} />

      <button
        type="button"
        onClick={() => setShowComment((prev) => !prev)}
        className="mt-6 flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
      >
        <MessageSquare size={18} />
        Comments {comment?.length ? `(${comment.length})` : ""}
      </button>

      <div
        className={cn(
          "mt-4 overflow-hidden rounded-2xl border border-border bg-card transition-all",
          !showComment && "hidden"
        )}
      >
        {comment?.length > 0 && (
          <div className="flex justify-end border-b border-border px-4 py-3">
            <Pagination page={page} totalPage={totalPage} setPage={setPage} />
          </div>
        )}

        <div className="px-4">
          {comment?.length > 0 ? (
            comment.map((c) => (
              <CommentItem
                key={c._id}
                username={c.username}
                avatar={c.avatar}
                content={c.content}
                createdAt={c.createdAt}
                likes={c.likes}
                likedby={c.likedby}
                isOwner={user._id === c.owner}
                replyCount={c.reply}
                showReplies={replyShowIds.includes(c._id)}
                onToggleReplies={() => toggleReplyVisibility(c._id)}
                onLike={() => toggleCommentLike(c._id)}
                onDelete={() => deleteComment(c._id)}
              >
                {replyShowIds.includes(c._id) && (
                  <CommentReply
                    commentId={c._id}
                    setComment={setComment}
                    videoId={videoId}
                  />
                )}
              </CommentItem>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No comments yet. Be the first to share your thoughts.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default CommentList;
