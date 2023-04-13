import React, { useState, useEffect } from "react";
import axios from "axios";

const Pagination = ({
  limit,
  currentPage,
  onPageChange,
  setLimit,
  setSkip,
  setCurrentPage,
  startDate,
  endDate,
}) => {
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState([]);
  const [selectCk, setSelectCk] = useState(false);

  useEffect(() => {
    axios
      .get("/data/data.json")
      .then((res) => {
        const filtered = res.data.filter((data) => {
          return (
            (!startDate || data.date >= startDate) &&
            (!endDate || data.date <= endDate)
          );
        });
        const length = filtered.length;
        const tmpCnt = Math.ceil(length / limit);
        setPageCount(tmpCnt);
        setPages(Array.from({ length: tmpCnt }, (v, i) => i + 1));
      })
      .catch((err) => console.log(err));
  }, [limit, currentPage, startDate, endDate]);

  //if (pageCount === 1) return null;

  const pageRange = 10;
  let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  let endPage = Math.min(pageCount, startPage + pageRange - 1);
  if (endPage - startPage + 1 < pageRange) {
    startPage = Math.max(1, endPage - pageRange + 1);
  }

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setCurrentPage(1);
    setSkip(0);
    onPageChange(1);
    setSelectCk(true);
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <>
      {pages.length === 0 && selectCk === false && pageCount === 0 ? (
        undefined
      ) : (
        <nav style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <select
              className="form-select form-select-sm"
              aria-label=".form-select-sm example"
              value={limit}
              onChange={handleLimitChange}
            >
              <option value={5}>5개씩 보기</option>
              <option value={10}>10개씩 보기</option>
              <option value={20}>20개씩 보기</option>
            </select>
          </div>
          <ul className="pagination justify-content-center pagination-sm">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {pages.slice(startPage - 1, endPage).map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage && "active"}`}
                onClick={() => handlePageClick(page)}
              >
                <button className="page-link">{page}</button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === pageCount && "disabled"}`}
            >
              <button
                className="page-link"
                disabled={currentPage === pageCount}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Pagination;
