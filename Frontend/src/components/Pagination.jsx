import React from "react";
import "../cssStyles/pagination.css";
import { useRef } from "react";

function Pagination({ page, setPage, totalPage, setTotalPage }) {
  const showbtnLimit = totalPage > 2 + page ? 2 + page : totalPage;
  let btnarr = [];
  for (let i = page; i <= showbtnLimit; i++) {
    btnarr.push(i);
  }

  const selectedBtn = page;

  return (
    <div className="paginationBtnWrapper">
      <button
        className="prevBtn"
        onClick={() => {
          if (page > 1) setPage(page - 1);
        }}
      >
        prev
      </button>
      <div className="pageBtn">
        {btnarr.map((btnNum) => {
          return (
            <button
              key={btnNum}
              className={selectedBtn === btnNum ? "active" : ""}
              onClick={(e) => {
                setPage(btnNum);
              }}
            >
              {btnNum}
            </button>
          );
        })}
      </div>
      <button
        className="nextBtn"
        onClick={() => {
          setPage((prev) => (prev + 1 > totalPage ? 1 : prev + 1));
        }}
      >
        next
      </button>
    </div>
  );
}

export default Pagination;
