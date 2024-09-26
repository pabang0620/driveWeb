import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import TitleBox from "../../components/TitleBox";
import Spinner from "../../components/Spinner";
import { dummyboardData } from "../../components/dummy";
import useCheckPermission from "../../utils/useCheckPermission";
import "./board.scss";

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
    </div>
  );
};

export default BoardPost;
