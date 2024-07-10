import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TitleBox from "../../components/TitleBox";

const BoardPost = () => {
  const navigate = useNavigate(); // history 객체 가져오기

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "첫 번째 게시글",
      content: "이 곳에 첫 번째 게시글의 내용이 들어갑니다.",
      date: "2024-07-10",
      author: "홍길동",
    },
    {
      id: 2,
      title: "두 번째 게시글",
      content: "이 곳에 두 번째 게시글의 내용이 들어갑니다.",
      date: "2024-07-11",
      author: "이몽룡",
    },
    {
      id: 3,
      title: "세 번째 게시글",
      content: "이 곳에 세 번째 게시글의 내용이 들어갑니다.",
      date: "2024-07-12",
      author: "성춘향",
    },
    // 나머지 게시글들도 포함시켜야 함
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const handleWriteButtonClick = () => {
    alert("글쓰기 버튼 클릭!");
  };

  // 현재 페이지의 게시글 목록
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지네이션 버튼 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    // 여기서 검색 기능을 구현할 수 있습니다. 현재는 UI만 제공합니다.
    alert("검색 버튼 클릭!");
  };
  const handlePostClick = (postId) => {
    navigate(`/board/post/${postId}`); // navigate 함수를 호출하여 경로 지정
  };
  return (
    <div className="boardPost">
      <TitleBox title="게시판" subtitle="공지사항" />

      <div className="boardPostHeader">
        <button className="writeButton" onClick={handleWriteButtonClick}>
          글쓰기
        </button>
      </div>

      <div className="tableWrapper">
        <table className="postTable">
          <thead>
            <tr>
              <th style={{ width: "8%", height: "44px" }}>번호</th>
              <th style={{ width: "70%", height: "44px" }}>제목</th>
              <th style={{ width: "10%", height: "44px" }}>작성자</th>
              <th style={{ width: "12%", height: "44px" }}>작성시간</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr
                key={post.id}
                className="postItem"
                style={{ height: "44px" }}
                onClick={() => handlePostClick(post.id)}
              >
                <td style={{ textAlign: "center" }}>{post.id}</td>
                <td style={{ textAlign: "left" }}>{post.title}</td>
                <td style={{ textAlign: "center" }}>{post.author}</td>
                <td className="postItemDate" style={{ textAlign: "center" }}>
                  {post.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 버튼 */}
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            className={`pageButton ${number === currentPage ? "active" : ""}`}
          >
            {number}
          </button>
        ))}
      </div>
      {/* 검색 UI */}
      <div className="searchWrapper">
        <select className="searchSelect">
          <option value="title">제목</option>
          <option value="author">작성자</option>
        </select>
        <input type="text" placeholder="검색어 입력" className="searchInput" />
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
          .boardPostHeader {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 10px 0px 10px 20px;
          }
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
          }
          .writeButton:hover {
            background-color: #05aced;
          }
          .searchWrapper {
            display: flex;
            margin: 50px auto;
            align-items: center;
            justify-content: center;
          }
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
          }
          .searchButton:hover {
            background-color: #05aced;
          }
          .tableWrapper {
            margin-top: 20px;
            height: 484px;
            overflow-y: auto; /* 세로 스크롤이 필요한 경우를 대비하여 */
            overflow-x: hidden; /* 가로 스크롤이 발생하지 않도록 */
          }
          .postTable {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed; /* 테이블 너비 고정 */
          }
          .postTable th,
          .postTable td {
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #d9d9d9; /* 테이블 셀 간 경계선 없애기 */
          }
          .postTable th {
            background-color: #fff;
            font-weight: bold;
            border-top: 1px solid black;
            border-bottom: 1px solid #ddd; /* 상단 헤더 아래쪽에 굵은 선 추가 */
          }
          .postItem:hover {
            cursor: pointer;
          }
          .postItemDate {
            color: #999;
          }
          .pagination {
            margin-top: 20px;
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
          }
          .pageButton:hover {
            background-color: #05aced;
          }
          .pageButton.active {
            background-color: #05aced;
            font-weight: bold;
          }
        }
      `}</style>
    </div>
  );
};

export default BoardPost;
