import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TitleBox from "../../components/TitleBox";
import CategorySetting from "./CategorySetting";
import SearchBox from "./SearchBox";

function BoardManagement() {
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 페이지당 항목 수
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState([]); // 선택된 게시물 ID 리스트

  const fetchPosts = async (page) => {
    try {
      const response = await axios.get("/api/admin/posts", {
        params: {
          page,
          limit: itemsPerPage,
        },
      });

      const postsData = response.data.posts.map((post) => ({
        id: post.id,
        title: post.title,
        category: post.boards.name,
        author: post.users.nickname,
        createdDate: new Date(post.createdAt).toLocaleDateString(),
        boardLevel: "N/A", // 이 필드는 데이터에 따라 조정해야 할 수 있습니다.
      }));

      setBoardData(postsData);
      setTotalPages(response.data.totalPages); // 전체 페이지 수를 설정
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleNoticeClick = (id) => {
    navigate(`/board/post/${id}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  const handleCheckboxChange = (id) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter((postId) => postId !== id));
    } else {
      setSelectedPosts([...selectedPosts, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPosts.length === 0) {
      alert("삭제할 게시물을 선택하세요.");
      return;
    }

    const confirmDelete = window.confirm(
      "선택된 게시물을 정말 삭제하시겠습니까?"
    );
    if (!confirmDelete) {
      return; // 사용자가 삭제를 취소한 경우 함수 종료
    }

    try {
      await axios.delete("/api/admin/posts", {
        data: { ids: selectedPosts },
      });
      alert("선택된 게시물이 삭제되었습니다.");
      setSelectedPosts([]);
      setCurrentPage(1); // 첫 페이지로 돌아가도록 설정
      fetchPosts(1); // 첫 페이지의 게시물 리스트를 다시 불러오기
    } catch (error) {
      console.error("Failed to delete posts", error);
      alert("게시물 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="board-management">
      <TitleBox title="관리자페이지" subtitle="게시판관리" />
      <CategorySetting />
      <h4>게시글 관리</h4>
      <SearchBox />

      <button
        className="seletedDeleted"
        onClick={handleDeleteSelected}
        disabled={selectedPosts.length === 0}
      >
        선택된 게시물 삭제
      </button>

      <table className="board_table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPosts(boardData.map((item) => item.id));
                  } else {
                    setSelectedPosts([]);
                  }
                }}
                checked={
                  selectedPosts.length === boardData.length &&
                  boardData.length > 0
                }
              />
            </th>
            <th>ID</th>
            <th>제목</th>
            <th>카테고리</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {boardData.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </td>
              <td onClick={() => handleNoticeClick(item.id)}>{item.id}</td>
              <td onClick={() => handleNoticeClick(item.id)}>{item.title}</td>
              <td onClick={() => handleNoticeClick(item.id)}>
                {item.category}
              </td>
              <td onClick={() => handleNoticeClick(item.id)}>{item.author}</td>
              <td onClick={() => handleNoticeClick(item.id)}>
                {item.createdDate}
              </td>
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
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          다음
        </button>
        <button onClick={handleLastPage} disabled={currentPage === totalPages}>
          맨 뒤로
        </button>
        <span>
          {currentPage} / {totalPages} 페이지
        </span>
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
          .seletedDeleted {
            background-color: #f44336;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
          }
          .seletedDeleted:hover {
            background-color: #d32f2f;
            color: white;
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
            align-items: center;
            margin-top: 20px;
          }
          .pagination button {
            margin: 0 5px;
            padding: 8px 12px;
            border: none;
            background-color: #f0f0f0;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .pagination span {
            margin-left: 10px;
            font-size: 14px;
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
