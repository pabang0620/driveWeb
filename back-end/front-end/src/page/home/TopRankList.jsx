import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const TopRankList = ({ posts }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { permission } = decodedToken;

        // permission 값이 1, 2, 3, 4, 5 중 하나인지 확인
        if ([1, 2, 3, 4, 5].includes(permission)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);

    if (diffHours < 1) {
      return `${Math.floor(diffHours * 60)}분 전`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}시간 전`;
    } else if (diffHours < 48) {
      return "1일 전";
    } else if (diffHours < 72) {
      return "2일 전";
    } else if (diffHours < 168) {
      return `${Math.floor(diffHours / 24)}일 전`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNoticeClick = (id) => {
    if (isAuthorized) {
      navigate(`/board/post/${id}`);
    } else {
      alert("로그인 해주세요.");
    }
  };

  return (
    <div className="postListBox">
      {posts.length === 0 ? (
        <div className="noPostsMessage">작성된 글이 없습니다.</div>
      ) : (
        <div className="postList">
          {posts.map((post) => (
            <div
              key={post.id}
              className="postBox"
              onClick={() => handleNoticeClick(post.id)}
            >
              <h4>{post.title}</h4>
              <p>{formatRelativeDate(post.createdAt)}</p>
              <p>[{post._count.comments}]</p>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .postListBox {
          width: 100%;
          padding: 10px;

          .postList {
            background-color: white;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            gap: 5px;
            .postBox {
              width: 100%;
              padding: 5px;
              display: flex;
              justify-content: flex-start;
              gap: 10px;
              align-items: center;
              &:not(:nth-of-type(1)) {
                border-top: 1px solid #ddd;
              }
              h4 {
                font-size: 14px;
                font-weight: normal;
                color: #222;
                @media (max-width: 768px) {
                }
              }
              p {
                font-size: 12px;
                color: #222;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default TopRankList;
