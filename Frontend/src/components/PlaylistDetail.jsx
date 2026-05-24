import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { axiosPrivate } from "../api/axios";
import VideoCard from "./VideoCard";
import EmptyPage from "./EmptyPage";
import { useAuth } from "../contexts/AuthContext";
import Model from "../model/Model";
import CreatePlaylist from "../model/CreatePlaylist";
import UserAvatar from "./UserAvatar";
import Button from "./ui/Button";
import { cn } from "../lib/cn";

function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState(null);
  const [playlistDetail, setPlaylistDetail] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const getPlaylistDetail = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/playlist/${playlistId}`);
      const data = response.data;
      if (data.success) {
        const { _id, name, description, videos, isPrivate, owner } = data.data;
        setPlaylistDetail({
          _id,
          name,
          description,
          isPrivate,
          imageUrl: videos?.[0]?.thumbnail,
          owner,
        });
        setVideos(videos || []);
      }
    } catch {
      setVideos([]);
      setPlaylistDetail({});
    }
  };

  useEffect(() => {
    getPlaylistDetail();
  }, [playlistId]);

  if (!playlistDetail) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const isOwner = playlistDetail.owner?._id === user?._id;

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative aspect-[21/9] max-h-56 w-full overflow-hidden bg-muted sm:aspect-[3/1]">
          {playlistDetail.imageUrl ? (
            <img
              src={playlistDetail.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[140px] items-center justify-center bg-gradient-to-br from-primary/20 to-accent/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                {playlistDetail.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    playlistDetail.isPrivate
                      ? "bg-muted text-foreground"
                      : "bg-primary/15 text-primary"
                  )}
                >
                  {playlistDetail.isPrivate ? "Private" : "Public"}
                </span>
                <span>{videos?.length ?? 0} videos</span>
              </div>
              {playlistDetail.owner && (
                <button
                  type="button"
                  className="mt-4 flex items-center gap-2 text-left"
                  onClick={() =>
                    navigate(`/user/${playlistDetail.owner.username}`)
                  }
                >
                  <UserAvatar
                    src={playlistDetail.owner.avatar}
                    name={playlistDetail.owner.username}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-foreground">
                    @{playlistDetail.owner.username}
                  </span>
                </button>
              )}
              {playlistDetail.description && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {playlistDetail.description}
                </p>
              )}
            </div>
            {isOwner && (
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5"
                onClick={() => setIsOpen(true)}
              >
                <Pencil size={16} />
                Edit
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {videos?.length > 0 ? (
          videos.map((video) => <VideoCard {...video} key={video._id} />)
        ) : (
          <div className="col-span-full">
            <EmptyPage title="Empty collection" desc="No videos in this collection yet." />
          </div>
        )}
      </div>

      <Model isOpen={isOpen} isClose={setIsOpen}>
        <CreatePlaylist
          state="edit"
          playlistId={playlistId}
          description={playlistDetail.description}
          playlistDetail={playlistDetail}
          setPlaylistDetail={setPlaylistDetail}
        />
      </Model>
    </>
  );
}

export default PlaylistDetail;
