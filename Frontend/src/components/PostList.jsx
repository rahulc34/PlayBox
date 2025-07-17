import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import UserHeader from "./UserHeader";
import EmptyPage from "./EmptyPage";

function PostList({ userId }) {
  const [posts, setposts] = useState("");
  const { user } = useAuth();

  const getAllPost = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/tweets/user/${userId}`);
      const data = response.data;
      console.log(data);
      if (data.success) {
        setposts(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <>
      {userId === user._id && <UserHeader title="Post" count={posts.length} />}
      <div className="plylistwrapper">
        {posts &&
          posts.map(({ owner, content, _id, createdAt }) => {
            return (
              <div key={_id} className="playlistcontain">
                <div className="playlist-content">
                  <p className="description">{content}</p>
                  {userId === user._id && (
                    <button className="editBtn">Edit</button>
                  )}
                </div>
              </div>
            );
          })}
        {!posts.length && (
          <EmptyPage
            title="No Posts Found"
            desc="This channel yet have to make post"
          />
        )}
      </div>
    </>
  );
}

export default PostList;
