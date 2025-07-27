import React, { useEffect, useState } from "react";
import PostCreate from "./PostCreate";
import { axiosPrivate } from "../api/axios";
import dislikelogo from "../assests/thumb.png";
import likelogo from "../assests/like.png";
import deleteIcon from "../assests/delete.png";
import { useAuth } from "../contexts/AuthContext";

function CommentList({ videoId }) {
  const { user } = useAuth();
  const [comment, setComment] = useState([]);
  const [replyShow, setReplyShow] = useState(false);

  const getComment = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/comments/${videoId}`);
      const data = response.data;
      if (data.success) {
        setComment(data.data?.comments);
      }
    } catch (error) {
      console.log(error);
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
          },
          ...comment,
        ]);
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
        console.log(response);
        console.log(commentId);
        setComment((prev) => prev.filter((com) => com._id !== commentId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const replyHandler = async (content) => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/comments/${videoId}/${replyShow}`,
        {
          content,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("componenet get commment");
    getComment();
  }, [videoId]);
  return (
    <div>
      <PostCreate submitHandler={createComment} />
      {comment &&
        comment.length &&
        comment.map(
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
              <div style={{ display: "flex", margin: "18px 0" }}>
                <img
                  src={avatar}
                  alt="sdf"
                  width="45px"
                  height="45px"
                  style={{ borderRadius: "50%", margin: "10px" }}
                />
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
                          setReplyShow((prev) => (prev === _id ? "" : _id));
                        }}
                      >
                        reply
                      </button>
                    </div>
                    <div
                      style={{
                        display: replyShow === _id ? "block" : "none",
                        margin: "10px",
                      }}
                    >
                      <PostCreate submitHandler={() => replyHandler(content)} />
                    </div>
                    <button
                      style={{
                        border: "0",
                        borderRadius: "10px",
                        padding: "4px 8px",
                        marginTop: "8px",
                        backgroundColor: "blue",
                        color: "white",
                        fontSize: "0.9rem",
                      }}
                    >
                      {reply} reply
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        )}
    </div>
  );
}

export default CommentList;
