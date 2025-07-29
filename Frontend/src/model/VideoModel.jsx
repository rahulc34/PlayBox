import React, { useState } from "react";
import "../cssStyles/CreatePlaylist.css";
import { axiosPrivate } from "../api/axios";

function VideoModel({ state, video, setChannelVideo }) {
  const [videoFile, setVideoFile] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [title, setTitle] = useState(video?.title || "");
  const [desc, setDesc] = useState(video?.description || "");
  const [isPrivate, setIsPrivate] = useState(
    video?.isPublished ? "public" : "private"
  );
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const [progressBar, setProgressBar] = useState(0);

  const updateVideo = async () => {
    if (!title && !description) {
      setIsError("please enter the title and description");
      return;
    }

    const formData = new FormData();
    const credentials = {
      thumbnail: videoThumbnail,
      title,
      description: desc,
      isPublished: isPrivate !== "private",
    };
    // console.log("credentials", credentials);
    for (let key in credentials) {
      formData.append(key, credentials[key]);
    }
    try {
      setLoading(true);
      setOnSuccess(false);
      // console.log("sending ....");
      const response = await axiosPrivate.patch(
        `/api/v1/videos/${video._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        setOnSuccess(response.data.message);
        const newUpdatedVideo = response.data.data;
        setChannelVideo((prev) => {
          return prev.map((videodetail) =>
            videodetail._id === video._id ? newUpdatedVideo : videodetail
          );
        });
      }
      setLoading(false);
    } catch (error) {
      // console.log(error);
      setLoading(false);
      setIsError(error.response?.data?.message);
    }
  };

  const uploadVideo = async () => {
    if (!videoThumbnail || !videoFile) {
      setIsError("File is missing");
      return;
    }

    const formData = new FormData();
    const credentials = {
      videoFile,
      thumbnail: videoThumbnail,
      title,
      description: desc,
      isPublished: isPrivate !== "private",
    };

    for (let key in credentials) {
      formData.append(key, credentials[key]);
    }
    try {
      setLoading(true);
      setOnSuccess(false);
      const response = await axiosPrivate.post(`/api/v1/videos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgressBar(percent);
        },
      });
      // console.log(response);
      if (response.data.success) {
        setOnSuccess(response.data.message);
        const data = response.data.data;
        setChannelVideo((prev) => [...prev, data]);
      }
      setLoading(false);
    } catch (error) {
      // console.log(error);
      setLoading(false);
      setIsError(error.response?.data?.message);
    }
  };

  const videoFileHandler = (e) => {
    const { size, type, name } = e.target.files[0];
    const allowedFileType = ["video/mp4", "video/mov", "video/3gpp/jpeg"];
    const maxsize = 15 * 1024 * 1024;
    if (allowedFileType.includes(type) && size < maxsize) {
      setVideoFile(e.target.files[0]);
    } else {
      size >= maxsize
        ? setIsError("video File is Too Large")
        : setIsError("Invalid video File type");
    }
  };

  const thumbnailFileHandler = (e) => {
    const { size, type, name } = e.target.files[0];
    const allowedFileType = ["image/png", "image/jpg", "image/jpeg"];
    const maxsize = 10 * 1024 * 1024;
    if (allowedFileType.includes(type) && size < maxsize) {
      setVideoThumbnail(e.target.files[0]);
    } else {
      size >= maxsize
        ? setIsError("image File is Too Large")
        : setIsError("Invalid image File type");
    }
  };

  if (loading)
    return (
      <h1>
        {progressBar === "100" ? "uploading to cloudinary..." : progressBar}
      </h1>
    );
  if (onSuccess) return <h2>{onSuccess}</h2>;

  return (
    <>
      <div className="createPlaylistWrapper">
        <p>{state === "editVideo" ? "Edit" : "Upload"} video</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (state === "editVideo") updateVideo();
            else uploadVideo();
          }}
        >
          {state !== "editVideo" && (
            <div className="inputContainer">
              <span>Video file</span>
              <input
                type="file"
                required
                accept="video/*"
                onChange={(e) => {
                  setIsError("");
                  videoFileHandler(e);
                }}
                // style={{ border: "1px solid red" }}
              />
              <ul>
                <li>File should be mp4/mov/3gp</li>
                <li>max size 15mb</li>
              </ul>
            </div>
          )}

          <div className="inputContainer">
            <span>Thumbnail</span>
            <input
              type="file"
              required={state !== "editVideo"}
              accept="image/*"
              onChange={(e) => {
                setIsError("");
                const { size, type, name } = e.target.files[0];
                // console.log(size, type, name);
                thumbnailFileHandler(e);
              }}
              // style={{ border: "1px solid " }}
            />
            <ul>
              <li>File should be png/jpg/jpeg</li>
              <li>max size 10mb</li>
            </ul>
          </div>
          <div className="inputContainer">
            <span>Title</span>
            <input
              type="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="inputContainer">
            <span>Description</span>
            <input
              type="input"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="private" className="private">
              Private
            </label>
            <input
              type="radio"
              id="private"
              checked={isPrivate === "private"}
              onChange={(e) => {
                setIsPrivate("private");
              }}
            />
            <label htmlFor="public" className="private">
              Public
            </label>
            <input
              type="radio"
              id="public"
              checked={isPrivate === "public"}
              onChange={(e) => {
                setIsPrivate("public");
              }}
            />
          </div>
          <div className="btncontainer">
            <button className="create">Upload</button>
          </div>
        </form>
        {isError && (
          <div className="error" style={{ maxWidth: "300px" }}>
            {isError}
          </div>
        )}
      </div>
    </>
  );
}

export default VideoModel;
