import { useState } from "react";
import { axiosPrivate } from "../api/axios";
import Button from "../components/ui/Button";
import {
  FormLabel,
  FormInput,
  FormTextarea,
  FormFileInput,
  VisibilityToggle,
  ModalStatus,
} from "../components/ui/FormField";

function VideoModel({ state, video, setChannelVideo }) {
  const [videoFile, setVideoFile] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [title, setTitle] = useState(video?.title || "");
  const [desc, setDesc] = useState(video?.description || "");
  const [visibility, setVisibility] = useState(
    video?.isPublished !== false ? "public" : "private"
  );
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const [progressBar, setProgressBar] = useState(0);

  const isEdit = state === "editVideo";

  const updateVideo = async () => {
    if (!title?.trim() || !desc?.trim()) {
      setIsError("Please enter title and description");
      return;
    }
    const formData = new FormData();
    const credentials = {
      title,
      description: desc,
      isPublished: visibility === "public",
    };
    if (videoThumbnail) credentials.thumbnail = videoThumbnail;
    for (const key in credentials) {
      if (credentials[key]) formData.append(key, credentials[key]);
    }
    try {
      setLoading(true);
      setOnSuccess(false);
      const response = await axiosPrivate.patch(
        `/api/v1/videos/${video._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        setOnSuccess(true);
        const newUpdatedVideo = response.data.data;
        setChannelVideo?.((prev) =>
          prev.map((v) => (v._id === video._id ? newUpdatedVideo : v))
        );
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setIsError(err.response?.data?.message || "Update failed");
    }
  };

  const uploadVideo = async () => {
    if (!videoThumbnail || !videoFile) {
      setIsError("Video and thumbnail are required");
      return;
    }
    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", videoThumbnail);
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("isPublished", visibility === "public");
    try {
      setLoading(true);
      setOnSuccess(false);
      const response = await axiosPrivate.post(`/api/v1/videos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgressBar(percent);
        },
      });
      if (response.data.success) {
        setOnSuccess(true);
        setChannelVideo?.((prev) => [...(prev || []), response.data.data]);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setIsError(err.response?.data?.message || "Upload failed");
    }
  };

  const videoFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["video/mp4", "video/quicktime", "video/3gpp"];
    const maxsize = 15 * 1024 * 1024;
    if (allowed.includes(file.type) && file.size < maxsize) {
      setVideoFile(file);
      setIsError("");
    } else {
      setIsError(
        file.size >= maxsize ? "Video file is too large (max 15 MB)" : "Invalid video type"
      );
    }
  };

  const thumbnailFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpg", "image/jpeg"];
    const maxsize = 10 * 1024 * 1024;
    if (allowed.includes(file.type) && file.size < maxsize) {
      setVideoThumbnail(file);
      setIsError("");
    } else {
      setIsError(
        file.size >= maxsize ? "Image is too large (max 10 MB)" : "Invalid image type"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">
          {progressBar >= 100
            ? "Processing upload…"
            : progressBar > 0
              ? `Uploading ${progressBar}%`
              : "Starting upload…"}
        </p>
        {progressBar > 0 && progressBar < 100 && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressBar}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  if (onSuccess) {
    return (
      <ModalStatus
        success
        successText={isEdit ? "Video updated successfully" : "Video uploaded successfully"}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-foreground">
        {isEdit ? "Edit video" : "Upload video"}
      </h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (isEdit) updateVideo();
          else uploadVideo();
        }}
      >
        {!isEdit && (
          <div className="space-y-1.5">
            <FormLabel>Video file</FormLabel>
            <FormFileInput
              required
              accept="video/mp4,video/quicktime,video/3gpp"
              onChange={videoFileHandler}
            />
            <p className="text-xs text-muted-foreground">MP4 or MOV, max 15 MB</p>
          </div>
        )}
        <div className="space-y-1.5">
          <FormLabel>Thumbnail</FormLabel>
          <FormFileInput
            required={!isEdit}
            accept="image/png,image/jpeg,image/jpg"
            onChange={thumbnailFileHandler}
          />
          <p className="text-xs text-muted-foreground">PNG or JPG, max 10 MB</p>
        </div>
        <div className="space-y-1.5">
          <FormLabel htmlFor="video-title">Title</FormLabel>
          <FormInput
            id="video-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <FormLabel htmlFor="video-desc">Description</FormLabel>
          <FormTextarea
            id="video-desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
            rows={3}
          />
        </div>
        <VisibilityToggle value={visibility} onChange={setVisibility} />
        <Button
          type="submit"
          className="w-full"
          text={isEdit ? "Save changes" : "Upload video"}
        />
      </form>
      {isError && <ModalStatus error={isError} />}
    </div>
  );
}

export default VideoModel;
