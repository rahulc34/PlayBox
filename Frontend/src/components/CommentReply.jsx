import React from "react";
import { useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import dislikelogo from "../assests/thumb.png";
import likelogo from "../assests/like.png";
import deleteIcon from "../assests/delete.png";
import { useAuth } from "../contexts/AuthContext";

function CommentReply({ commentId, setReplyBox }) {
  const { user } = useAuth();
  const [reply, setReply] = useState([]);

  const toggleCommentLike = async (commentId) => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/likes/toggle/c/${commentId}`
      );
      console.log(response);
      if (response.data.success) {
        const { likes } = response.data.data || {};
        setReply((prev) =>
          prev.map((comment) => {
            if (comment._id === commentId) {
              const likedby = comment.likedby;
              const newcomment = { ...comment, likedby: !likedby, likes };
              return newcomment;
            } else return comment;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axiosPrivate.delete(
        `/api/v1/comments/c/${commentId}`
      );

      if (response.data.success) {
        setReply((prev) => prev.filter((com) => com._id !== commentId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getReply = async () => {
    const respone = await axiosPrivate.get(`/api/v1/comments/c/${commentId}`);
    if (respone.data.success) {
      console.log(respone.data.data);
      setReply(respone.data.data.comments);
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReply();
  }, []);

  return (
    <div>
      {reply &&
        reply.length &&
        reply.map(
          ({
            _id,
            avatar,
            content,
            createdAt,
            reply,
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
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "inherit",
                          fontSize: "0.8rem",
                        }}
                        onClick={() => {
                          setReplyBox((prev) =>
                            prev === commentId ? "" : commentId
                          );
                        }}
                      >
                        reply
                      </button>
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
