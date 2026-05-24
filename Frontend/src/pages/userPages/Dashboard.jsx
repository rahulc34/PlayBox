import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Eye,
  Film,
  Users,
  ThumbsUp,
  Upload,
  ExternalLink,
} from "lucide-react";
import UserHeader from "../../components/UserHeader";
import { useAuth } from "../../contexts/AuthContext";
import { axiosPrivate } from "../../api/axios";
import Model from "../../model/Model";
import VideoModel from "../../model/VideoModel";
import { DeletePlaylist } from "../../model/DeletePlaylist.jsx";
import UpdateProfile from "../../model/UpdateProfile.jsx";
import UserAvatar from "../../components/UserAvatar";
import EmptyPage from "../../components/EmptyPage";
import Button from "../../components/ui/Button";
import { formatUsername } from "../../lib/format";
import { cn } from "../../lib/cn";

function Dashboard() {
  const { user } = useAuth();
  const [channelStatus, setChannelStatus] = useState(null);
  const [channelVideos, setChannelVideos] = useState(null);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [uploadVideo, setUploadVideo] = useState(false);
  const [isEditVideo, setIsEditVideo] = useState(false);
  const [editVideo, setEditVideo] = useState("");
  const [deleteVideo, setDeleteVideo] = useState(false);
  const [videoId, setVideoId] = useState("");
  const navigate = useNavigate();

  const getChannelStatus = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/dashboard/stats");
      if (response.data.success) setChannelStatus(response.data.data);
    } catch {
      setChannelStatus({});
    }
  };

  const getChannelVideos = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/dashboard/videos");
      if (response.data.success) {
        setChannelVideos(response.data.data.videos || []);
      }
    } catch {
      setChannelVideos([]);
    }
  };

  useEffect(() => {
    getChannelStatus();
    getChannelVideos();
  }, []);

  const firstName = user?.fullname?.split(" ")?.[0] || user?.username;

  const stats = [
    { label: "Total views", value: channelStatus?.totalViews || 0, icon: Eye },
    {
      label: "Subscribers",
      value: channelStatus?.totalSubscribers || 0,
      icon: Users,
    },
    { label: "Total likes", value: channelStatus?.totalLikes || 0, icon: ThumbsUp },
    { label: "Videos", value: channelStatus?.totalVideos || 0, icon: Film },
  ];

  return (
    <>
      <div className="space-y-8">
        <UserHeader
          title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          onAction={() => setUploadVideo(true)}
          actionLabel="Upload video"
        />

        {/* Profile hero */}
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="relative h-36 sm:h-44 md:h-52">
            {user?.coverImage ? (
              <img
                src={user.coverImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/40 via-primary/20 to-accent/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>

          <div className="relative px-4 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                <div className="rounded-full ring-4 ring-card">
                  <UserAvatar
                    src={user?.avatar}
                    name={user?.fullname || user?.username}
                    size="2xl"
                    className="!h-24 !w-24 sm:!h-28 sm:!w-28"
                  />
                </div>
                <div className="pb-1">
                  <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                    {formatUsername(user?.username)}
                  </h2>
                  {user?.fullname && (
                    <p className="mt-0.5 text-base text-muted-foreground">
                      {user.fullname}
                    </p>
                  )}
                  <Link
                    to={`/user/${user?.username?.replace(/^@+/, "")}`}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View public channel
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="gap-2 self-start sm:self-auto"
                onClick={() => setIsProfileEdit(true)}
              >
                <Pencil size={16} />
                Edit profile
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/20"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={20} />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                {value.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Videos table */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Your videos
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage uploads, visibility, and edits
              </p>
            </div>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setUploadVideo(true)}
            >
              <Upload size={16} />
              Upload
            </Button>
          </div>

          {channelVideos === null ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          ) : channelVideos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 sm:px-6">Live</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Video</th>
                    <th className="px-4 py-3">Engagement</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {channelVideos.map((video) => {
                    const {
                      _id,
                      thumbnail,
                      title,
                      views,
                      isPublished,
                      likes,
                      createdAt,
                    } = video;
                    return (
                      <tr
                        key={_id}
                        className="border-b border-border/50 transition hover:bg-muted/20"
                      >
                        <td className="px-4 py-3 sm:px-6">
                          <span
                            className={cn(
                              "inline-block h-2.5 w-2.5 rounded-full",
                              isPublished ? "bg-emerald-500" : "bg-amber-400"
                            )}
                            title={isPublished ? "Published" : "Draft"}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              isPublished
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            )}
                          >
                            {isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            className="flex max-w-xs items-center gap-3 text-left"
                            onClick={() => navigate(`/video/${_id}`)}
                          >
                            <img
                              src={thumbnail}
                              alt=""
                              className="h-12 w-20 shrink-0 rounded-lg object-cover"
                            />
                            <span className="line-clamp-2 font-medium text-foreground">
                              {title}
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <p>{likes || 0} likes</p>
                          <p>{views || 0} views</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditVideo(video);
                                setIsEditVideo(true);
                              }}
                              className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                              aria-label="Edit video"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setVideoId(_id);
                                setDeleteVideo(true);
                              }}
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
                              aria-label="Delete video"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-4 py-12 sm:px-6">
              <EmptyPage
                title="No videos yet"
                desc="Upload your first video to start building your channel."
              />
              <div className="mt-4 flex justify-center">
                <Button className="gap-2" onClick={() => setUploadVideo(true)}>
                  <Upload size={16} />
                  Upload video
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>

      <Model isOpen={uploadVideo} isClose={setUploadVideo}>
        <VideoModel setChannelVideo={setChannelVideos} />
      </Model>
      <Model isOpen={deleteVideo} isClose={setDeleteVideo}>
        <DeletePlaylist
          deleteVideoId={videoId}
          setChannelVideo={setChannelVideos}
          state="deleteVideo"
        />
      </Model>
      <Model isOpen={isEditVideo} isClose={setIsEditVideo}>
        <VideoModel
          state="editVideo"
          video={editVideo}
          setChannelVideo={setChannelVideos}
        />
      </Model>
      <Model isOpen={isProfileEdit} isClose={setIsProfileEdit}>
        <UpdateProfile onClose={setIsProfileEdit} />
      </Model>
    </>
  );
}

export default Dashboard;
