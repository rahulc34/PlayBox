import React, { useEffect, useState } from "react";
import PostCreate from "./PostCreate";
import { axiosPrivate } from "../api/axios";
import dislikelogo from "../assests/thumb.png";
import likelogo from "../assests/like.png";
import deleteIcon from "../assests/delete.png";
import revealComment from "../assests/revealComment.png";
import { useAuth } from "../contexts/AuthContext";
import showMoreIcon from "../assests/down-chevron.png";
import closeShowIcon from "../assests/up-chevron.png";
import CommentReply from "./CommentReply";
import Pagination from "./Pagination";

function CommentList({ videoId }) {
  const { user } = useAuth();
  const [comment, setComment] = useState([]);
  const [replyShowIds, setReplyShowIds] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [showComment, setShowComment] = useState(false);

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
        const { page, total } = data.data;
        console.log(page, total);
        setPage(page);
        setTotalPage(total / 10 + (total % 10 !== 0 ? 1 : 0));
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

  useEffect(() => {
    getComment();
  }, [videoId, page]);

  return (
    <div>
      <PostCreate submitHandler={createComment} />
      <button
        onClick={() => setShowComment((prev) => !prev)}
        style={{
          border: "none",
          backgroundColor: "inherit",
          margin: "20px",
          borderBottom: "1px solid black",
        }}
      >
        <img src={revealComment} alt="" width="24px" />
        <p>comments</p>
      </button>
      <div
        style={{
          display: showComment ? "block" : "none",
          transition: "all 0.2s ease",
        }}
      >
        {comment && comment.length && (
          <div>
            <Pagination
              page={page}
              totalPage={totalPage}
              setPage={setPage}
              setTotalPage={setTotalPage}
            />
          </div>
        )}

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
                        {reply} reply{" "}
                      </button>

                      <img
                        src={
                          replyShowIds.includes(_id)
                            ? closeShowIcon
                            : showMoreIcon
                        }
                        alt=""
                        width="14px"
                        style={{ marginLeft: "10px", cursor: "pointer" }}
                        onClick={() => {
                          toggleReplyVisibility(_id);
                        }}
                      />
                    </div>
                    {replyShowIds.includes(_id) && (
                      <CommentReply
                        commentId={_id}
                        setComment={setComment}
                        videoId={videoId}
                      />
                    )}
                  </div>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
}

export default CommentList;
