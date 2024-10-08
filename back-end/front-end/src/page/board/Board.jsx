import React, { useEffect, useState } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import BoardBox from "./BoardBox";

const Board = () => {
  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get("/api/post/latest");
        setBoardData(response.data);
      } catch (error) {
        console.error(
          "게시판 데이터를 가져오는 중 오류가 발생했습니다.",
          error
        );
      }
    };

    fetchBoardData();
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

  return (
    <div className="board">
      <TitleBox title="게시판" subtitle=" 전체" />
      <div className="boardFlex">
        {boardData.map((data, index) => (
          <BoardBox
            key={index}
            boardTitle={data.boardName}
            notices={data.posts.map((post) => ({
              id: post.id,
              title: post.title,
              date: formatRelativeDate(post.createdAt),
            }))}
          />
        ))}
      </div>
      <style jsx>{`
        .board {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          .boardFlex {
            height: 821px;
            margin: 50px 0 0;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default Board;
