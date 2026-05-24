import { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import VideoCard from "../../components/VideoCard";
import CenterDiv from "../../components/CenterDiv";
import EmptyPage from "../../components/EmptyPage";
import PageHeader from "../../components/PageHeader";

function History() {
  const [videos, setVideos] = useState(null);

  const getHistory = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/users/history");
      if (response.data.success) {
        setVideos(response.data.data);
      }
    } catch {
      setVideos([]);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div>
      <PageHeader
        title="Watch history"
        subtitle="Videos you've watched recently"
      />
      {videos === null ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <VideoCard {...video} key={video._id} />
          ))}
        </div>
      ) : (
        <CenterDiv>
          <EmptyPage
            title="History is empty"
            desc="Videos you watch will appear here."
          />
        </CenterDiv>
      )}
    </div>
  );
}

export default History;
