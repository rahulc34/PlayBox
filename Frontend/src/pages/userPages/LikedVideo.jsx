import { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import VideoCard from "../../components/VideoCard";
import EmptyPage from "../../components/EmptyPage";
import CenterDiv from "../../components/CenterDiv";
import PageHeader from "../../components/PageHeader";

function LikedVideo() {
  const [videos, setVideos] = useState(null);

  const getLikedVideos = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/likes/videos`);
      if (response.data.success) {
        setVideos(response.data.data);
      }
    } catch {
      setVideos([]);
    }
  };

  useEffect(() => {
    getLikedVideos();
  }, []);

  return (
    <div>
      <PageHeader
        title="Liked videos"
        subtitle={
          videos?.length
            ? `${videos.length} video${videos.length === 1 ? "" : "s"} saved`
            : "Videos you've liked"
        }
      />
      {videos === null ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map(({ videoList }) => (
            <VideoCard {...videoList} key={videoList._id} />
          ))}
        </div>
      ) : (
        <CenterDiv>
          <EmptyPage
            title="No liked videos"
            desc="Tap the like button on videos to save them here."
          />
        </CenterDiv>
      )}
    </div>
  );
}

export default LikedVideo;
