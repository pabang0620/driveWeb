import React, { useState, useEffect } from "react";
import { boardmanagementdummy } from "../../components/dummy";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BoardManagement() {
  const [tabs, setTabs] = useState([
    "전체",
    "공지사항",
    "자유게시판",
    "갤러리게시판",
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [boardData, setBoardData] = useState(boardmanagementdummy);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        let apiUrl = "/api/post/latest";

        switch (tabs[activeTab]) {
          case "공지사항":
            apiUrl = "/api/post/notice";
            break;
          case "자유게시판":
            apiUrl = "/api/post/freeboard";
            break;
          case "갤러리게시판":
            apiUrl = "/api/post/gallery";
            break;
          default:
            apiUrl = "/api/post/latest";
        }

        const response = await axios.get(apiUrl);
        setBoardData(response.data);
        setCurrentPage(1); // 탭 변경 시 첫 페이지로 리셋
      } catch (error) {
        console.error(
          "게시판 데이터를 가져오는 중 오류가 발생했습니다.",
          error
        );
      }
    };

    fetchBoardData();
  }, [activeTab]);

  const addNewTab = async () => {
    const newTabName = prompt("새 게시판 이름을 입력하세요:");
    if (newTabName) {
      try {
        const response = await axios.post("/api/board/add", {
          name: newTabName,
        });
        if (response.status === 201) {
          setTabs([...tabs, newTabName]);
          setActiveTab(tabs.length);
        } else {
          console.error("게시판 추가 중 오류 발생");
        }
      } catch (error) {
        console.error(
          "서버에 게시판 추가 요청을 보내는 중 오류가 발생했습니다.",
          error
        );
      }
    }
  };

  const handleNoticeClick = (id) => {
    navigate(`/board/post/${id}`);
  };

  const totalItems = boardData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = boardData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="board-management">
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={activeTab === index ? "active" : ""}
          >
            {tab}
          </button>
        ))}
        <button onClick={addNewTab}>+ 게시판 추가</button>
      </div>

      <div className="tab-content">
        <div className="board-list">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                {tabs[activeTab] === "전체" && <th>카테고리</th>}
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} onClick={() => handleNoticeClick(item.id)}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  {tabs[activeTab] === "전체" && <td>{item.category}</td>}
                  <td>{item.author}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
          <button
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
          >
            맨 뒤로
          </button>
        </div>
      </div>

      <style jsx>{`
        .board-management {
          padding: 20px;
          .tab-buttons {
            display: flex;
            margin-bottom: 20px;
          }
          .tab-buttons button {
            margin-right: 10px;
            padding: 10px 15px;
            border: none;
            background-color: #f0f0f0;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .tab-buttons button.active {
            background-color: #007bff;
            color: white;
          }
          .tab-content {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th,
          td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          tr {
            cursor: pointer;
          }
          tr:nth-of-type(even) {
            background-color: #f1f1f1;
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
