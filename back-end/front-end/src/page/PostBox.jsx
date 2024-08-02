import React from "react";
import { useNavigate } from "react-router-dom";

const PostBox = ({ id, postTitle, commentsCount, date }) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/board/post/${id}`);
  };

  return (
    <div className="postBox" onClick={handlePostClick}>
      <div className="postBoxTitle">{postTitle}</div>
      <div className="postBoxInfo">
        <span className="postBoxComments">Comments: {commentsCount}</span>
        <span className="postBoxDate">{date}</span>
      </div>
      <style jsx>{`
        .postBox {
          width: 47%;
          padding: 10px 20px;
          background: #fff;
          border: 10px solid #e0e0e0;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          margin-bottom: 10px;
        }
        .postBoxTitle {
          font-size: 20px;
          font-weight: bold;
          margin: 5px 0;
        }
        .postBoxInfo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
        }
        .postBoxComments {
          background-color: #05aced;
          color: #fff;
          padding: 3px 7px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .postBoxDate {
          margin-left: 10px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default PostBox;
