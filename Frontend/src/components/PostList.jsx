import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import EmptyPage from "./EmptyPage";
import CenterDiv from "./CenterDiv.jsx";
import PostCreate from "./PostCreate.jsx";
import deleteIcon from "../assests/delete.png";
import dislikelogo from "../assests/thumb.png";
import likelogo from "../assests/like.png";

function PostList({ userId }) {
  const [posts, setposts] = useState([]);
  const { user } = useAuth();

  const getAllPost = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/tweets/user/${userId}`);
      const data = response.data;
      // console.log(data);
      if (data.success) {
        setposts(data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getAllPost();
  }, [userId]);

  const createPost = async (content) => {
    if (!content?.trim()) return;
    try {
      const response = await axiosPrivate.post("/api/v1/tweets", { content });
      // console.log(response);
      if (response.data.success) {
        const tweet = response.data.data;
        setposts((prev) => [{ ...tweet, likes: 0, likedby: false }, ...prev]);
      }
      // console.log(response);
    } catch (error) {
      // console.log(error);
    }
  };

  const deleteTweet = async (tweetId) => {
    try {
      const response = await axiosPrivate.delete(`/api/v1/tweets/${tweetId}`);
      if (response.data.success) {
        const post = response.data.data;
        setposts((prev) => prev.filter((post) => post._id !== tweetId));
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const toggleTweetLike = async (tweetId) => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/likes/toggle/t/${tweetId}`
      );

      if (response.data.success) {
        const { likes } = response.data.data || {};
        console.log(likes);
        setposts((prev) =>
          prev.map((post) => {
            if (post._id === tweetId) {
              const likedby = post.likedby
              const newpost = { ...post, likedby: !likedby, likes };
              return newpost;
            } else return post;
          })
        );
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      {userId === user._id && (
        <div className="playlist-header">
          <p className="name">{posts.length} Post</p>
        </div>
      )}
      {userId === user._id && <PostCreate submitHandler={createPost} />}
      <div className="plylistwrapper">
        {posts.length &&
          posts.map(({ content, _id, createdAt, likedby, likes }) => {
            const likeBtnUrl = likedby ? likelogo : dislikelogo;
            return (
              <div key={_id} className="playlistcontain">
                <p style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                  {new Date(createdAt).toLocaleDateString()}
                  {"  "}
                  {new Date(createdAt).toLocaleTimeString()}
                </p>
                <div className="playlist-content">
                  <p className="description" style={{ fontSize: "1rem" }}>
                    {content}
                  </p>
                  {userId === user._id && (
                    <button
                      className="editBtn"
                      onClick={() => deleteTweet(_id)}
                    >
                      <img src={deleteIcon} alt="delete" width="19px" />
                    </button>
                  )}
                  <button
                    className="like"
                    onClick={() => {
                      toggleTweetLike(_id);
                    }}
                  >
                    <p>{likes || 0}</p>
                    <img src={likeBtnUrl} />
                  </button>
                </div>
              </div>
            );
          })}
        {!posts.length && (
          <CenterDiv>
            <EmptyPage
              title="No Posts Found"
              desc="This channel yet have to make post"
            />
          </CenterDiv>
        )}
      </div>
    </>
  );
}

export default PostList;
