import React, { useState } from "react";
import "../cssStyles/Filter.css";
import filterIcon from "../assests/filterIcon.png";

function Filter({ setUploadDate, setDuration, setShortBy, getVideos }) {
  const [showFilter, setShowFilter] = useState(true);
  return (
    <>
      <div className="filter">
        <button
          className="open"
          onClick={() => setShowFilter((prev) => !prev)}
          style={{
            border: "none",
            backgroundColor: "inherit",
            marginLeft: "18px",
          }}
        >
          <img src={filterIcon} alt="filter" width="20px" />
        </button>
        <div className={"filterWrapper" + (showFilter ? " disablefilter" : "")}>
          <div>
            <label htmlFor="type">TYPE</label>
            <select name="" id="type">
              <option value="video">Video</option>
              {/* <option value="channel">Channel</option>
              <option value="playlist">Playlist</option> */}
            </select>
          </div>
          <div>
            <label
              htmlFor="uploadDate"
              onClick={(e) => {
                setUploadDate(e.target.value);
              }}
            >
              UPLOAD DATE
            </label>
            <select
              name=""
              id="uploadDate"
              onChange={(e) => {
                setUploadDate(e.target.value);
              }}
            >
              <option value="hour">Last hour</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="year">This year</option>
            </select>
          </div>
          <div>
            <label htmlFor="shortBy">SHORT BY</label>
            <select
              id="shortBy"
              onChange={(e) => {
                setShortBy(e.target.value);
              }}
            >
              <option value="CreatedAt">Upload date</option>
              <option value="views">Views</option>
            </select>
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <select
              name=""
              id="duration"
              onChange={(e) => {
                setDuration(e.target.value);
              }}
            >
              <option value="short">Under 4 minutes</option>
              <option value="medium">Above 4 min and below 20 min</option>
              <option value="long">Above 20 minutes</option>
            </select>
          </div>
          <button
            className="applyFilter"
            onClick={() => {
              getVideos();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}

export default Filter;
