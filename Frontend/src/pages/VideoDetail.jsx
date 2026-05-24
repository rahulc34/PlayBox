import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios.js";
import VideoDetailCard from "../components/VideoDetailCard.jsx";
import VideoList from "../components/VideoList.jsx";

function VideoDetail() {
  const { videoId } = useParams();
  const [video, setVideo] = useState("");

  const getVideoById = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/videos/${videoId}`);
      const data = response.data;
      if (data.success) setVideo(data.data);
    } catch {
      /* ignore */
    }
  };

  const viewIncrease = async () => {
    if (!video) return;
    try {
      await axiosPrivate.patch(`/api/v1/videos/saveIncView/${videoId}`);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getVideoById();
  }, [videoId]);

  useEffect(() => {
    if (!video?.duration) return;
    const timeToIncreaseView =
      20 >= video.duration ? (video.duration / 2) * 1000 : 10000;
    const intervalId = setTimeout(viewIncrease, timeToIncreaseView);
    return () => clearTimeout(intervalId);
  }, [video, videoId]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="max-w-4xl">
        {video && <VideoDetailCard video={video} setVideo={setVideo} />}
      </div>
      {video && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            More videos
          </h2>
          <VideoList />
        </section>
      )}
    </div>
  );
}

export default VideoDetail;
