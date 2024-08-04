import React from "react";
import { useNavigate } from "react-router-dom";

const TopRankList = ({ posts }) => {
  const navigate = useNavigate();
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
    navigate(`/board/post/${id}`);
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
              <p>{post._count.comments}</p>
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
