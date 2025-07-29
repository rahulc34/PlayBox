import React from "react";
import { useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import dislikelogo from "../assests/thumb.png";
import likelogo from "../assests/like.png";
import deleteIcon from "../assests/delete.png";
import { useAuth } from "../contexts/AuthContext";
import PostCreate from "./PostCreate";

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
          prev.map((comment) => {
            if (comment._id === replyId) {
              const likedby = comment.likedby;
              const newcomment = { ...comment, likedby: !likedby, likes };
              return newcomment;
            } else return comment;
          })
        );
      }
    } catch (error) {
    }
  };

  const deleteComment = async (replyId) => {
    try {
      const response = await axiosPrivate.delete(
        `/api/v1/comments/c/${replyId}`
      );

      if (response.data.success) {
        setReply((prev) => prev.filter((com) => com._id !== replyId));
      }
    } catch (error) {
    }
  };

  const getReply = async () => {
    try {
      const respone = await axiosPrivate.get(`/api/v1/comments/c/${commentId}`);
      if (respone.data.success) {
        setReply(respone.data.data?.comments || []);
      }
    } catch (error) {
    }
  };

  const replyHandler = async (content) => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/comments/${videoId}/${commentId}`,
        {
          content,
        }
      );
      if (response.data.success) {
        const newReply = response.data.data;
        const { username, avatar } = user;
        setReply([
          { ...newReply, likes: 0, likedby: false, username, avatar },
          ...reply,
        ]);
        setComment((prev) =>
          prev.filter((com) =>
            com._id === commentId ? { ...com, reply: com.reply + 1 } : com
          )
        );
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getReply();
  }, [commentId]);

  return (
    <div>
      <div
        style={{
          margin: "10px",
        }}
      >
        <PostCreate submitHandler={replyHandler} />
      </div>
      {reply?.length > 0 &&
        reply.map(
          ({
            _id,
            avatar,
            content,
            createdAt,
            username,
            likedby,
            likes,
            owner,
          }) => {
            const likeBtnUrl = likedby ? likelogo : dislikelogo;

            return (
              <div style={{ display: "flex", margin: "18px 0" }} key={_id}>
                <div
                  className="profile-container"
                  style={{ boxShadow: "none", margin: "10px" }}
                >
                  <img src={avatar} alt="sdf" className="profile" />
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                    }}
                  >
                    <p>{username}</p>
                    <p style={{ padding: "0 8px", fontSize: "0.7rem" }}>
                      {new Date(createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p>{content}</p>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={likeBtnUrl}
                        alt="like"
                        width="20px"
                        onClick={() => {
                          toggleCommentLike(_id);
                        }}
                      />
                      <p>{likes || 0}</p>
                      {user._id === owner && (
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "inherit",
                            marginTop: "4px",
                          }}
                          onClick={() => {
                            deleteComment(_id);
                          }}
                        >
                          <img src={deleteIcon} alt="" width="17px" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
    </div>
  );
}

export default CommentReply;
