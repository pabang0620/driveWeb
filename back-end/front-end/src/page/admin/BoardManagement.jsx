import React, { useState, useEffect } from "react";
import { boardmanagementdummy } from "../../components/dummy";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import TitleBox from "../../components/TitleBox";
import CategorySetting from "./CategorySetting";
import SearchBox from "./SearchBox";

function BoardManagement() {
  const [boardData, setBoardData] = useState(boardmanagementdummy);
  const [filteredBoards, setFilteredBoards] = useState(boardData);
  const [categories, setCategories] = useState([
    { id: 1, name: "전체", visible: true },
    { id: 2, name: "공지사항", visible: true },
    { id: 3, name: "자유게시판", visible: true },
    { id: 4, name: "갤러리게시판", visible: true },
  ]);

  const [filters, setFilters] = useState({
    searchTerm: "",
    boardLevelFilter: "",
    authorFilter: "",
    categoryFilter: "",
    startDateFilter: "",
    endDateFilter: "",
  });
  const filterFields = [
    {
      id: "searchTerm",
      label: "검색어:",
      type: "text",
    },
    {
      id: "categoryFilter",
      label: "카테고리:",
      type: "select",
      options: [
        ...categories.map((category) => ({
          value: category.name,
          label: category.name,
        })),
      ],
    },
    {
      id: "boardLevelFilter",
      label: "게시판 레벨:",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: "Administrator", label: "Administrator" },
        { value: "Moderator", label: "Moderator" },
        { value: "Advanced", label: "Advanced" },
        { value: "Regular", label: "Regular" },
        { value: "Newbie", label: "Newbie" },
      ],
    },
    {
      id: "dateRangeFilter",
      label: "기간:",
      type: "dateRange",
      startDateKey: "startDateFilter",
      endDateKey: "endDateFilter",
    },
  ];
  const handleNoticeClick = (id) => {
    Navigate(`/board/post/${id}`);
  };

  /*-------------페이지네이션-------------*/
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBoards.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = filteredBoards.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  /*--------------------------*/

  /*-------------검색-------------*/
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = () => {
    console.log(filters);
    const {
      searchTerm,
      boardLevelFilter,
      authorFilter,
      categoryFilter,
      startDateFilter,
      endDateFilter,
    } = filters;

    // 날짜 필터 값이 빈 문자열이 아닌 경우만 변환
    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;

    const newFilteredBoards = boardData.filter((board) => {
      const createdDate = new Date(board.createdDate);

      // 날짜가 유효한지 확인
      const isWithinDateRange =
        (!startDate || createdDate >= startDate) &&
        (!endDate || createdDate <= endDate);

      // 검색어, 작성자, 게시판 레벨, 카테고리 필터 확인
      const matchesSearchTerm =
        (board.title &&
          board.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (board.content &&
          board.content.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesAuthor = !authorFilter || board.author === authorFilter;
      const matchesBoardLevel =
        !boardLevelFilter || board.boardLevel === boardLevelFilter;
      const matchesCategory =
        !categoryFilter || board.category === categoryFilter;

      return (
        matchesSearchTerm &&
        matchesBoardLevel &&
        matchesCategory &&
        matchesAuthor &&
        isWithinDateRange
      );
    });

    setFilteredBoards(newFilteredBoards);
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: "",
      boardLevelFilter: "",
      authorFilter: "",
      categoryFilter: "",
      startDateFilter: "",
      endDateFilter: "",
    });
    setFilteredBoards(boardData);
    setCurrentPage(1); // 필터 초기화 후 페이지를 1로 리셋
  };

  return (
    <div className="board-management">
      <TitleBox title="관리자페이지" subtitle="게시물관리" />
      <CategorySetting categories={categories} setCategories={setCategories} />
      <h4>게시글 관리</h4>
      <SearchBox
        filters={filters}
        filterFields={filterFields}
        categories={categories}
        handleFilterChange={handleFilterChange}
        handleSearchClick={handleSearchClick}
        handleResetFilters={handleResetFilters}
      />
      <table className="board_table">
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>카테고리</th>
            <th>작성자(등급)</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id} onClick={() => handleNoticeClick(item.id)}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>
                {item.author}({item.boardLevel})
              </td>
              <td>{item.createdDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handleFirstPage} disabled={currentPage === 1}>
          맨 앞으로
        </button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          다음
        </button>
        <button onClick={handleLastPage} disabled={currentPage === totalPages}>
          맨 뒤로
        </button>
      </div>
      <style jsx>{`
        .board-management {
          width: 75%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }

          /*------------------검색박스-------------------- */
          .searchBox {
            border: 1px solid #ddd;
            padding: 2%;
            margin: 20px 0 5px 0;
            display: flex;
            margin-top: 10px;
            gap: 10px 30px;
            flex-wrap: wrap;

            label {
              font-size: 14px;
              margin-right: 5px;
              min-width: 65px;
            }

            input,
            select {
              padding: 3px 5px;
              font-size: 14px;
            }
          }
          .searchBtnBox {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            gap: 5px;
            button {
              padding: 5px 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 12px;
              transition: background-color 0.3s;
            }
            .search_button {
              color: white;
              background-color: #3c5997;
              &:hover {
                background-color: #7388b6;
              }
            }
            .reset_button {
              background-color: #e0e0e0; /* 회색 계열 배경색 */
              color: #333; /* 어두운 텍스트 색상 */
              &:hover {
                background-color: #b0b0b0; /* 호버 시 조금 어두운 회색 */
              }
            }
          }
          /*------------------게시물테이블------------------*/
          table.board_table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            tr {
              cursor: pointer;
              &:hover {
                background-color: #f9f9f9;
              }
            }
            th,
            td {
              border: 1px solid #ddd;
            }

            th {
              background-color: #f4f4f4;
              font-size: 14px;
              padding: 10px 0;
              @media (max-width: 768px) {
                font-size: 12px;
                padding: 5px;
              }
            }

            td {
              font-size: 14px;
              padding: 3px 0;
              text-align: center;
              @media (max-width: 768px) {
                font-size: 12px;
                padding: 2px;
              }
              select {
                width: 80%;
                padding: 3px 0;
                font-size: 14px;
                @media (max-width: 768px) {
                  font-size: 12px;
                }
              }
            }

            button {
              margin: 5px;
              padding: 8px 16px;
              border: none;
              border-radius: 5px;
              background-color: #3c5997;
              color: white;
              cursor: pointer;
              font-size: 14px;
              transition: background-color 0.3s;
              &:hover {
                background-color: #7388b6;
              }
              @media (max-width: 768px) {
                font-size: 12px;
                padding: 5px 10px;
                white-space: nowrap;
              }
            }
          }

          .pagination {
            display: flex;
            justify-content: center;
          }
          .pagination button {
            margin: 0 5px;
            padding: 8px 12px;
            border: none;
            background-color: #f0f0f0;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .pagination button.active {
            background-color: #007bff;
            color: white;
          }
        }
      `}</style>
    </div>
  );
}

export default BoardManagement;
