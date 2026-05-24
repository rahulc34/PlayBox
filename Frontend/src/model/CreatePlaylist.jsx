import { useState } from "react";
import { axiosPrivate } from "../api/axios";
import Button from "../components/ui/Button";
import {
  FormLabel,
  FormInput,
  FormTextarea,
  VisibilityToggle,
  ModalStatus,
} from "../components/ui/FormField";

function CreatePlaylist({
  state,
  playlistId,
  setPlaylists,
  playlists = [],
  setPlaylistDetail,
  playlistDetail,
  onSuccess,
}) {
  const [title, setTitle] = useState(playlistDetail?.name || "");
  const [description, setDescription] = useState(
    playlistDetail?.description || ""
  );
  const [visibility, setVisibility] = useState(
    playlistDetail?.isPrivate ? "private" : "public"
  );
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState("");

  const editPlaylist = async () => {
    try {
      setLoading(true);
      setCreated(false);
      setError("");
      const content = {
        name: title,
        description,
        isPrivate: visibility === "private",
      };
      const response = await axiosPrivate.patch(
        `/api/v1/playlist/${playlistId}`,
        content
      );
      if (response.data.success) {
        setCreated(true);
        setPlaylistDetail?.({ ...playlistDetail, ...content });
        onSuccess?.();
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to update collection");
    }
  };

  const submitHandler = async () => {
    try {
      setLoading(true);
      setCreated(false);
      setError("");
      const content = {
        name: title,
        description,
        isPrivate: visibility === "private",
      };
      const response = await axiosPrivate.post("/api/v1/playlist", content);
      const data = response.data;
      if (data.success && data.data) {
        setCreated(true);
        const { _id, name, description, owner } = data.data;
        setPlaylists?.([
          ...playlists,
          { _id, name, description, owner, totalVideos: 0 },
        ]);
        onSuccess?.();
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to create collection");
    }
  };

  if (loading || created) {
    return (
      <ModalStatus
        loading={loading}
        success={created}
        loadingText={state === "edit" ? "Saving…" : "Creating…"}
        successText={
          state === "edit"
            ? "Collection updated successfully"
            : "Collection created successfully"
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-foreground">
        {state === "edit" ? "Edit collection" : "New collection"}
      </h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (state === "edit") editPlaylist();
          else submitHandler();
        }}
      >
        <div className="space-y-1.5">
          <FormLabel htmlFor="playlist-title">Title</FormLabel>
          <FormInput
            id="playlist-title"
            type="text"
            value={title}
            required
            placeholder="My favorites"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <FormLabel htmlFor="playlist-desc">Description</FormLabel>
          <FormTextarea
            id="playlist-desc"
            value={description}
            required
            rows={3}
            placeholder="What's this collection about?"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <VisibilityToggle value={visibility} onChange={setVisibility} />
        <Button type="submit" className="w-full" text={state === "edit" ? "Save changes" : "Create collection"} />
      </form>
      {error && <ModalStatus error={error} />}
    </div>
  );
}

export default CreatePlaylist;
