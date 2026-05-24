import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import PostCreate from "./PostCreate";
import CommentItem from "./CommentItem";

function CommentReply({ commentId, setComment, videoId }) {
  const { user } = useAuth();
  const [reply, setReply] = useState([]);

  const toggleCommentLike = async (replyId) => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/likes/toggle/c/${replyId}`
      );
      if (response.data.success) {
        const { likes } = response.data.data || {};
        setReply((prev) =>
          prev.map((r) =>
            r._id === replyId ? { ...r, likedby: !r.likedby, likes } : r
          )
        );
      }
    } catch {
      /* ignore */
    }
  };

  const deleteComment = async (replyId) => {
    try {
      const response = await axiosPrivate.delete(
        `/api/v1/comments/c/${replyId}`
      );
      if (response.data.success) {
        setReply((prev) => prev.filter((com) => com._id !== replyId));
        setComment((prev) =>
          prev.map((com) =>
            com._id === commentId
              ? { ...com, reply: Math.max(0, (com.reply || 1) - 1) }
              : com
          )
        );
      }
    } catch {
      /* ignore */
    }
  };

  const getReply = async () => {
    try {
      const respone = await axiosPrivate.get(`/api/v1/comments/c/${commentId}`);
      if (respone.data.success) {
        setReply(respone.data.data?.comments || []);
      }
    } catch {
      /* ignore */
    }
  };

  const replyHandler = async (content) => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/comments/${videoId}/${commentId}`,
        { content }
      );
      if (response.data.success) {
        const newReply = response.data.data;
        const { username, avatar } = user;
        setReply([
          {
            ...newReply,
            likes: 0,
            likedby: false,
            username,
            avatar,
            owner: user._id,
          },
          ...reply,
        ]);
        setComment((prev) =>
          prev.map((com) =>
            com._id === commentId ? { ...com, reply: (com.reply || 0) + 1 } : com
          )
        );
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    getReply();
  }, [commentId]);

  return (
    <div className="space-y-2 rounded-xl bg-muted/30 p-3">
      <PostCreate submitHandler={replyHandler} placeholder="Write a reply…" />
      {reply?.map((r) => (
        <CommentItem
          key={r._id}
          isReply
          username={r.username}
          avatar={r.avatar}
          content={r.content}
          createdAt={r.createdAt}
          likes={r.likes}
          likedby={r.likedby}
          isOwner={user._id === r.owner}
          onLike={() => toggleCommentLike(r._id)}
          onDelete={() => deleteComment(r._id)}
        />
      ))}
    </div>
  );
}

export default CommentReply;
