import React from "react";
import { axiosPrivate } from "../api/axios";
import { useEffect, useState } from "react";
import VideoCard from "./VideoCard.jsx";
import "../cssStyles/VideoCard.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import EmptyPage from "./EmptyPage.jsx";
import UserHeader from "./UserHeader.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import VideoModel from "../model/VideoModel.jsx";
import Model from "../model/Model.jsx";
import Pagination from "./Pagination.jsx";
import Filter from "./Filter.jsx";
import CenterDiv from "./CenterDiv.jsx";

function VideoList({ userId }) {
  // const {
  //   page = 1,
  //   limit = 10,
  //   sortType = "desc", "asc"
  //   sortBy = "createdAt",views, likes
  //   upload date // last hour, today, this weeks, this month, this year
  //   duration, "short", "medium", "long"
  //   userId,
  //   query,
  // } = req.query;
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [uploadDate, setUploadDate] = useState("");
  const [duration, setDuration] = useState("");
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setShortBy] = useState("");
  // const [selectContentType, setContentType] = useState("video")
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
      setError(false);
    } catch (error) {
      // console.log(error);
      setLoading(false);
      setError(true);
      setErrorMsg(error.response.data.message);
      console.log(error.response.data.message);
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
      <Filter
        setUploadDate={setUploadDate}
        setDuration={setDuration}
        setShortBy={setShortBy}
        getVideos={getVideos}
      />
      <Pagination
        page={page}
        setPage={setPage}
        setTotalPage={setTotalPage}
        totalPage={totalPage}
      />
      <div className="grid-container">
        {videos &&
          videos.map((video) => <VideoCard {...video} key={video._id} />)}
        {!videos && !videos?.length && userId && (
          <CenterDiv>
            <EmptyPage
              title="No Video found"
              desc="this channel has yet to upload videos"
            />
          </CenterDiv>
        )}
      </div>
      <Model isClose={setOpen} isOpen={open}>
        <VideoModel />
      </Model>
    </>
  );
}

export default VideoList;
