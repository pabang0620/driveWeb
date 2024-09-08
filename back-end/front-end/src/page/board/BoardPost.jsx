import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import TitleBox from "../../components/TitleBox";
import Spinner from "../../components/Spinner";
import { dummyboardData } from "../../components/dummy";
import useCheckPermission from "../../utils/useCheckPermission";

const BoardPost = () => {
  // useCheckPermission();

  const navigate = useNavigate();
  const { boardId } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [boardName, setBoardName] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `/api/post/board/${boardId}?page=${currentPage}&search=${searchTerm}`
        );
        const sortedPosts = response.data.posts.sort((a, b) => b.id - a.id);

        setPosts(sortedPosts);
        setTotalPosts(response.data.totalPosts);
        setBoardName(response.data.board.name);
      } catch (error) {
        console.error(
          "게시글 데이터를 가져오는 중 오류가 발생했습니다.",
          error
        );
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [boardId, currentPage]);

  const handleSearch = async () => {
    try {
      setCurrentPage(1);
      const response = await axios.get(
        `/api/post/board/${boardId}?page=${currentPage}&search=${searchTerm}`
      );
      const sortedPosts = response.data.posts.sort((a, b) => b.id - a.id);

      setPosts(sortedPosts);
      setTotalPosts(response.data.totalPosts);
    } catch (error) {
      console.error("게시글 데이터를 가져오는 중 오류가 발생했습니다.", error);
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleWriteButtonClick = () => {
    navigate("/board/post/add", { state: { boardId } });
  };

  const handlePostClick = (postId) => {
    navigate(`/board/post/${postId}`, { state: { boardId } });
  };

  const totalPages = Math.ceil(totalPosts / 10);
  const maxButtonsToShow = 5;
  const startPage =
    Math.floor((currentPage - 1) / maxButtonsToShow) * maxButtonsToShow + 1;
  const endPage = Math.min(startPage + maxButtonsToShow - 1, totalPages);
  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (!posts) {
    return <Spinner />;
  }
  return (
    <div className="boardPost">
      <div className="boardPostHeader">
        <TitleBox title="게시판" subtitle={boardName} />
        <button className="writeButton" onClick={handleWriteButtonClick}>
          글쓰기
        </button>
      </div>

      <div className="tableWrapper">
        <table className="postTable">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성시간</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr
                key={post.id}
                className="postItem"
                onClick={() => handlePostClick(post.id)}
              >
                <td>{post.id}</td>
                <td>
                  {post.title} [{post._count.comments}]
                </td>
                <td>{post.users.nickname}</td>
                <td className="postItemDate">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {startPage > 1 && (
          <button
            onClick={() => handlePageClick(startPage - 1)}
            className="pageButton"
          >
            &lt;
          </button>
        )}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            className={`pageButton ${number === currentPage ? "active" : ""}`}
          >
            {number}
          </button>
        ))}
        {endPage < totalPages && (
          <button
            onClick={() => handlePageClick(endPage + 1)}
            className="pageButton"
          >
            &gt;
          </button>
        )}
      </div>

      <div className="searchWrapper">
        <select className="searchSelect">
          <option value="all">전체</option>
        </select>
        <input
          type="text"
          placeholder="검색어 입력"
          className="searchInput"
          value={searchTerm}
          onChange={handleSearchInputChange} // 검색어 입력 시 상태 업데이트
        />
        <button className="searchButton" onClick={handleSearch}>
          검색
        </button>
      </div>

      <style jsx>{`
        .boardPost {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
        }
        .boardPostHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .writeButton {
            padding: 8px 16px;
            background-color: #05aced;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            outline: none;
            &:hover {
              background-color: #05aced;
            }
            @media (max-width: 768px) {
              font-size: 14px;
            }
          }
        }

        .searchWrapper {
          display: flex;
          margin: 50px auto;
          align-items: center;
          justify-content: center;

          .searchSelect {
            margin-right: 10px;
            padding: 8px 14px;
            border-radius: 5px;
            border: 1px solid #ccc;
          }
          .searchInput {
            padding: 8px;
            border-radius: 5px;
            border: 1px solid #ccc;
            margin-right: 10px;
            width: 200px;
            @media (max-width: 768px) {
              width: 55%;
            }
          }
          .searchButton {
            padding: 8px 16px;
            background-color: #05aced;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            outline: none;
            &:hover {
              background-color: #05aced;
            }
            @media (max-width: 768px) {
              font-size: 12px;
              padding: 10px;
            }
          }
        }

        .tableWrapper {
          margin-top: 20px;
          height: 503px;
          overflow-y: hidden; /* 세로 스크롤 제거 */
          overflow-x: hidden;
          @media (max-width: 768px) {
            height: auto;
          }
        }
        .postTable {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          th {
            background-color: #fff;
            font-weight: bold;
            border-top: 1px solid black;
            border-bottom: 1px solid #ddd;
            padding: 1.5% 0;
            &:nth-of-type(1) {
              width: 10%;
            }
            &:nth-of-type(2) {
              width: 50%;
            }
            &:nth-of-type(3) {
              width: 15%;
            }
            &:nth-of-type(4) {
              width: 15%;
            }
            @media (max-width: 768px) {
              font-size: 13px;
              &:nth-of-type(1) {
                width: 10%;
              }
              &:nth-of-type(2) {
                width: 50%;
              }
              &:nth-of-type(3) {
                width: 20%;
              }
              &:nth-of-type(4) {
                width: 20%;
              }
            }
            @media (max-width: 480px) {
              font-size: 12px;
            }
          }
          td {
            text-align: center;
            border-bottom: 1px solid #d9d9d9;
            padding: 1%;
            &:nth-of-type(2) {
              text-align: left;
            }
            @media (max-width: 768px) {
              font-size: 13px;
            }
            @media (max-width: 480px) {
              font-size: 11px;
              &:nth-of-type(3) {
                font-size: 10px;
              }
              &:nth-of-type(4) {
                font-size: 10px;
              }
            }
          }
        }

        .postItem:hover {
          cursor: pointer;
        }
        .postItemDate {
          color: #999;
        }
        .pagination {
          margin-top: 50px;
          text-align: center;
        }
        .pageButton {
          background-color: #05aced;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          padding: 8px 12px;
          margin-right: 5px;
          outline: none;
          &:hover {
            background-color: #05aced;
          }
          &.active {
            background-color: #05aced;
            font-weight: bold;
          }
          &:disabled {
            background-color: #ddd;
            cursor: not-allowed;
          }
        }
      `}</style>
    </div>
  );
};

export default BoardPost;
