import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import VideoCard from "./VideoCard.jsx";
import EmptyPage from "./EmptyPage.jsx";
import UserHeader from "./UserHeader.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import VideoModel from "../model/VideoModel.jsx";
import Model from "../model/Model.jsx";
import Pagination from "./Pagination.jsx";
import Filter from "./Filter.jsx";
import CenterDiv from "./CenterDiv.jsx";

function VideoList({ userId }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [uploadDate, setUploadDate] = useState("");
  const [duration, setDuration] = useState("");
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setShortBy] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getVideos = async () => {
    const query =
      `?page=${page}` +
      (userId ? `&userId=${userId}` : "") +
      (uploadDate ? `&uploadDate=${uploadDate}` : "") +
      (duration ? `&duration=${duration}` : "") +
      (sortType ? `&sortType=${sortType}` : "") +
      (sortBy ? `&sortBy=${sortBy}` : "");

    try {
      setLoading(true);
      setErrorMsg("");
      setError(false);
      const response = await axiosPrivate.get(`/api/v1/videos${query}`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        const fetchedVideos = data.data.videos;
        const { page: gotpage, limit, total } = data.data.pagination;
        setPage(gotpage);
        setTotalPage(total / limit + (total % limit !== 0));
        setVideos(fetchedVideos);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getVideos();
  }, [page]);

  if (error)
    return (
      <CenterDiv>
        <EmptyPage title={errorMsg} />
      </CenterDiv>
    );

  return (
    <>
      {userId === user._id && (
        <UserHeader title="Videos" count={videos?.length} isClose={setOpen} />
      )}

      <div className="flex flex-wrap items-end justify-between gap-4 py-5">
        <Filter
          setUploadDate={setUploadDate}
          setDuration={setDuration}
          setShortBy={setShortBy}
          getVideos={getVideos}
        />
        <Pagination page={page} setPage={setPage} totalPage={totalPage} />
      </div>

      {loading && !videos && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 pb-10 sm:grid-cols-2 xl:grid-cols-3">
        {videos?.map((video) => (
          <VideoCard {...video} key={video._id} />
        ))}
      </div>

      {!videos?.length && userId && (
        <CenterDiv>
          <EmptyPage
            title="No videos found"
            desc="This channel hasn't uploaded any videos yet."
          />
        </CenterDiv>
      )}

      <Model isClose={setOpen} isOpen={open}>
        <VideoModel />
      </Model>
    </>
  );
}

export default VideoList;
