import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import EmptyPage from "./EmptyPage";
import CenterDiv from "./CenterDiv";
import PostCreate from "./PostCreate";
import PostCard from "./PostCard";
import PageHeader from "./PageHeader";

function PostList({ userId }) {
  const [posts, setPosts] = useState(null);
  const { user } = useAuth();

  const getAllPost = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/tweets/user/${userId}`);
      if (response.data.success) {
        setPosts(response.data.data || []);
      }
    } catch {
      setPosts([]);
    }
  };

  useEffect(() => {
    getAllPost();
  }, [userId]);

  const createPost = async (content) => {
    if (!content?.trim()) return;
    try {
      const response = await axiosPrivate.post("/api/v1/tweets", { content });
      if (response.data.success) {
        const tweet = response.data.data;
        setPosts((prev) => [
          {
            ...tweet,
            likes: 0,
            likedby: false,
            username: user.username,
            avatar: user.avatar,
          },
          ...(prev || []),
        ]);
      }
    } catch {
      /* ignore */
    }
  };

  const deleteTweet = async (tweetId) => {
    try {
      const response = await axiosPrivate.delete(`/api/v1/tweets/${tweetId}`);
      if (response.data.success) {
        setPosts((prev) => prev.filter((post) => post._id !== tweetId));
      }
    } catch {
      /* ignore */
    }
  };

  const toggleTweetLike = async (tweetId) => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/likes/toggle/t/${tweetId}`
      );
      if (response.data.success) {
        const { likes } = response.data.data || {};
        setPosts((prev) =>
          prev.map((post) =>
            post._id === tweetId
              ? { ...post, likedby: !post.likedby, likes }
              : post
          )
        );
      }
    } catch {
      /* ignore */
    }
  };

  const isOwner = userId === user._id;

  return (
    <div>
      {isOwner ? (
        <>
          <PageHeader
            title="Posts"
            subtitle={posts?.length ? `${posts.length} post${posts.length === 1 ? "" : "s"}` : "Share updates with your audience"}
          />
          <div className="mb-6">
            <PostCreate submitHandler={createPost} placeholder="What's on your mind?" />
          </div>
        </>
      ) : (
        <PageHeader title="Posts" subtitle="Updates from this creator" />
      )}

      {posts === null ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : posts.length > 0 ? (
        <div className="mx-auto max-w-2xl space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              content={post.content}
              createdAt={post.createdAt}
              username={post.username || post.owner?.username}
              avatar={post.avatar || post.owner?.avatar}
              likes={post.likes}
              likedby={post.likedby}
              isOwner={isOwner}
              onLike={() => toggleTweetLike(post._id)}
              onDelete={() => deleteTweet(post._id)}
            />
          ))}
        </div>
      ) : (
        <CenterDiv>
          <EmptyPage
            title="No posts yet"
            desc={
              isOwner
                ? "Share your first update with followers."
                : "This creator hasn't posted anything yet."
            }
          />
        </CenterDiv>
      )}
    </div>
  );
}

export default PostList;
