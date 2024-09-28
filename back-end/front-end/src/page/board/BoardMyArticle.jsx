import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import TitleBox from "../../components/TitleBox";
import Spinner from "../../components/Spinner";
import { dummyboardData } from "../../components/dummy";
import useCheckPermission from "../../utils/useCheckPermission";
import "./board.scss";
import { jwtDecode } from "jwt-decode";
import BoardMyComment from "./BoardMyComment";
import NoticeZone from "../home/NoticeZone";

const BoardMyArticle = () => {
  // useCheckPermission();
  // JWT 토큰이 localStorage에 저장되어 있다고 가정
  const token = localStorage.getItem("token");

  // jwt-decode를 사용해 토큰 디코드
  const decodedToken = jwtDecode(token);

  // 토큰에서 userId 추출
  const userId = decodedToken.userId; // JWT payload에 userId가 있다고 가정
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [maintenanceItem, setMaintenanceItem] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `/api/post/user/${userId}?page=${currentPage}&search=${searchTerm}`
        );
        const sortedPosts = response.data.posts.sort((a, b) => b.id - a.id);

        setPosts(sortedPosts);
        setTotalPosts(response.data.totalPosts);
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
  }, [currentPage]);

  const handleSearch = async () => {
    try {
      setCurrentPage(1);
      const response = await axios.get(
        `/api/post/user/${userId}?page=${currentPage}&search=${searchTerm}`
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
    navigate("/board/post/add");
  };

  const handlePostClick = (postId) => {
    navigate(`/board/post/${postId}`);
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

  // 사용자의 maintenance items 가져오기
  const fetchUserMaintenanceItems = async () => {
    try {
      const response = await axios.get(`/api/mycar/maintenanceItems/${userId}`);
      setMaintenanceItem(response.data);
    } catch (error) {
      console.error("유지보수 항목을 가져오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트되면 데이터 불러오기
  useEffect(() => {
    fetchUserMaintenanceItems();
  }, []);
  if (!posts) {
    return <Spinner />;
  }
  return (
    <div>
      <NoticeZone maintenanceItem={maintenanceItem} />
      <div className="boardPost">
        <div className="boardPostHeader">
          <TitleBox title="게시판" subtitle="작성한 게시글" />
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
        <BoardMyComment />
      </div>
    </div>
  );
};

export default BoardMyArticle;
