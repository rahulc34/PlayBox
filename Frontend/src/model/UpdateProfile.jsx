import React, { useState } from "react";
import { axiosPrivate } from "../api/axios";

const UpdateProfile = ({ channel, setChannel }) => {
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState("");
  const [onSuccess, setOnSuccess] = useState("");
  const [progressBar, setProgressBar] = useState(0);

  const uploadHandler = async (operation) => {
    const content = operation === "avatar" ? avatar : banner;
    if (!content) {
      setIsError("FILE IS MISSING");
    }

    const url =
      "/api/v1/users/" + (operation === "avatar" ? "avatar" : "coverImage");
    try {
      setIsError(false);
      setLoading(true);
      setOnSuccess(false);
      const formData = new FormData();
      formData.append(operation, content);
      // console.log(operation, content, url);
      const response = await axiosPrivate.patch(url, formData, {
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
        setChannel({ ...channel, ...data });
      }
      setLoading(false);
    } catch (error) {
      // console.log(error);
      setLoading(false);
      setIsError(error.response?.data?.message);
    }
  };

  const imageFileHandler = (e, setState) => {
    const { size, type, name } = e.target.files[0];
    const allowedFileType = ["image/png", "image/jpg", "image/jpeg"];
    const maxsize = 10 * 1024 * 1024;
    if (allowedFileType.includes(type) && size < maxsize) {
      setState(e.target.files[0]);
    } else {
      size >= maxsize
        ? setIsError("image File is Too Large")
        : setIsError("Invalid image File type");
    }
  };

  // console.log(progressBar)
  if (loading)
    return (
      <h1>
        {progressBar === 100 ? "uploading to cloudinary..." : progressBar}
      </h1>
    );

  return (
    <>
      <div className="createPlaylistWrapper">
        <p>Update Profile</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            uploadHandler("coverImage");
          }}
        >
          <div className="inputContainer">
            <span>Banner</span>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => {
                setIsError("");
                imageFileHandler(e, setBanner);
              }}
            />
            <ul>
              <li>File should be png/jpg/jpeg</li>
              <li>max size 10mb</li>
            </ul>
          </div>
          <div className="btncontainer">
            <button className="create">Upload</button>
          </div>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            uploadHandler("avatar");
          }}
        >
          <div className="inputContainer">
            <span>Avatar</span>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => {
                setIsError("");
                imageFileHandler(e, setAvatar);
              }}
            />
            <ul>
              <li>File should be png/jpg/jpeg</li>
              <li>max size 10mb</li>
            </ul>
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
        {onSuccess && (
          <div
            style={{
              maxWidth: "300px",
              border: "1px solid green",
              color: "green",
              fontWeight: "600",
              paddingLeft: "4px",
              borderRadius: "4px",
            }}
          >
            {onSuccess}
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateProfile;
