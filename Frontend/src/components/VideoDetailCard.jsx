import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { axiosPrivate } from "../api/axios.js";
import LikeBtn from "./LikeBtn.jsx";
import Subscribe from "./Subscribe.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import Model from "../model/Model.jsx";
import AddVideoToPlaylist from "./AddVideoToPlaylist.jsx";
import CommentList from "./CommentList.jsx";
import { cn } from "../lib/cn";

const VideoDetailCard = ({ video, setVideo }) => {
  const {
    _id: videoId,
    owner,
    videoFile,
    title,
    description,
    views,
    PlaylistId: alreadySaved,
    createdAt,
  } = video;
  const {
    _id: userId,
    username,
    fullname,
    avatar,
    subscribersCount,
    isSubscribed,
  } = owner || {};

  const navigate = useNavigate();
  const [readMore, setReadMore] = useState(false);
  const [totalSubscription, setTotalSubscription] = useState(subscribersCount);
  const [addOpenPlaylist, setAddOpenPlaylist] = useState(false);
  const [isSaved, setIsSaved] = useState(alreadySaved || false);
  const { user } = useAuth();

  const removeVideoFromPlaylist = async () => {
    try {
      const respone = await axiosPrivate.patch(
        `/api/v1/playlist/remove/${videoId}/${isSaved}`
      );
      if (respone.data.success) setIsSaved("");
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    setIsSaved(alreadySaved || false);
    setTotalSubscription(subscribersCount);
  }, [video, alreadySaved, subscribersCount]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-black shadow-xl">
        <video key={videoId} controls className="aspect-video w-full">
          <source src={videoFile} />
        </video>
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {views} views · {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {videoId && <LikeBtn setVideo={setVideo} video={video} />}
            <button
              type="button"
              onClick={() =>
                isSaved ? removeVideoFromPlaylist() : setAddOpenPlaylist(true)
              }
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                isSaved
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              <Bookmark size={16} />
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
          <button
            type="button"
            className="flex items-center gap-3 text-left"
            onClick={() => navigate(`/user/${username}`)}
          >
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-violet-100 bg-violet-50">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-lg font-bold text-violet-600">
                  {(fullname || username || "?")[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">{fullname}</p>
              <p className="text-sm text-muted-foreground">
                {totalSubscription} subscribers
              </p>
            </div>
          </button>
          {userId !== user._id && (
            <Subscribe
              isSubscribed={isSubscribed}
              setTotalSubscription={setTotalSubscription}
              userId={userId}
            />
          )}
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <p
            className={cn(
              "text-sm leading-relaxed text-muted-foreground",
              !readMore && "line-clamp-3"
            )}
          >
            {description}
          </p>
          {description?.length > 120 && (
            <button
              type="button"
              className="mt-2 text-sm font-semibold text-primary hover:underline"
              onClick={() => setReadMore(!readMore)}
            >
              {readMore ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        <CommentList videoId={videoId} />
      </div>

      <Model isOpen={addOpenPlaylist} isClose={setAddOpenPlaylist}>
        <AddVideoToPlaylist
          videoId={videoId}
          setIsSaved={setIsSaved}
          setIsClosePlaylistAdd={setAddOpenPlaylist}
          video={video}
          setVideo={setVideo}
        />
      </Model>
    </>
  );
};

export default VideoDetailCard;
