import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { axiosPrivate } from "../api/axios";
import Button from "../components/ui/Button";
import { ModalStatus } from "../components/ui/FormField";

const DeletePlaylist = ({
  playlistId,
  setPlaylists,
  playlists,
  deleteVideoId,
  setChannelVideo,
  state,
}) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const isVideo = state === "deleteVideo";

  const handleDelete = async () => {
    try {
      setLoading(true);
      setDone(false);
      setError("");
      if (isVideo) {
        const response = await axiosPrivate.delete(
          `/api/v1/videos/${deleteVideoId}`
        );
        if (response.data.success) {
          setDone(true);
          setChannelVideo?.((prev) =>
            prev.filter((v) => v._id !== deleteVideoId)
          );
        }
      } else {
        const response = await axiosPrivate.delete(
          `/api/v1/playlist/${playlistId}`
        );
        if (response.data.success) {
          setDone(true);
          setPlaylists?.(playlists.filter((p) => p._id !== playlistId));
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading || done) {
    return (
      <ModalStatus
        loading={loading}
        success={done}
        loadingText="Deleting…"
        successText={`${isVideo ? "Video" : "Collection"} deleted successfully`}
      />
    );
  }

  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle size={24} />
      </div>
      <h2 className="font-display text-lg font-bold text-foreground">
        Delete {isVideo ? "video" : "collection"}?
      </h2>
      <p className="text-sm text-muted-foreground">
        This action cannot be undone.
      </p>
      <Button variant="danger" className="w-full" onClick={handleDelete} text="Delete permanently" />
      {error && <ModalStatus error={error} />}
    </div>
  );
};

export { DeletePlaylist };
