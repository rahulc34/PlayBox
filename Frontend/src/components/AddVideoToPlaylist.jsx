import { useEffect, useState } from "react";
import { Plus, ListVideo } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { axiosPrivate } from "../api/axios";
import EmptyPage from "./EmptyPage";
import Button from "./ui/Button";
import CreatePlaylist from "../model/CreatePlaylist";
import Model from "../model/Model";
import { ModalStatus } from "./ui/FormField";
import { cn } from "../lib/cn";

function AddVideoToPlaylist({ videoId, setIsSaved, setIsClosePlaylistAdd }) {
  const { user } = useAuth();
  const [playlistId, setPlaylistId] = useState("");
  const [playlists, setPlaylists] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const getAllPlaylist = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await axiosPrivate.get(
        `/api/v1/playlist/user/${user._id}`
      );
      if (response.data.success) {
        setPlaylists(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to load collections");
      setPlaylists([]);
    }
  };

  const addPlaylistHandler = async () => {
    if (!playlistId) {
      setError("Please select a collection");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const response = await axiosPrivate.patch(
        `/api/v1/playlist/add/${videoId}/${playlistId}`
      );
      if (response.data.success) {
        setIsSaved(playlistId);
        setSuccess(response.data.message || "Saved to collection");
        setTimeout(() => setIsClosePlaylistAdd?.(false), 1200);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Could not add video");
    }
  };

  useEffect(() => {
    getAllPlaylist();
  }, []);

  if (loading && !playlists) {
    return <ModalStatus loading loadingText="Loading collections…" />;
  }

  if (success) {
    return <ModalStatus success successText={success} />;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-foreground">
            Save to collection
          </h2>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            onClick={() => setOpenCreate(true)}
          >
            <Plus size={16} />
            New
          </Button>
        </div>

        {playlists?.length > 0 ? (
          <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {playlists.map(({ _id, name, totalVideos }) => (
              <li key={_id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition",
                    playlistId === _id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <input
                    type="radio"
                    name="playlist"
                    className="accent-primary"
                    checked={playlistId === _id}
                    onChange={() => setPlaylistId(_id)}
                  />
                  <ListVideo size={18} className="shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-foreground">
                      {name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {totalVideos ?? 0} videos
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyPage
            title="No collections yet"
            desc="Create a collection to organize your saved videos."
          />
        )}

        {playlists?.length > 0 && (
          <Button className="w-full" onClick={addPlaylistHandler} text="Add to collection" />
        )}
        {error && <ModalStatus error={error} />}
      </div>

      <Model isOpen={openCreate} isClose={setOpenCreate}>
        <CreatePlaylist
          playlists={playlists || []}
          setPlaylists={(updated) => {
            setPlaylists(updated);
            setOpenCreate(false);
          }}
          onSuccess={() => getAllPlaylist()}
        />
      </Model>
    </>
  );
}

export default AddVideoToPlaylist;
