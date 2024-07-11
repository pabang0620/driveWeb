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

  return (
    <div className="board">
      <TitleBox title="게시판" subtitle=" 전체" />
      <div className="boardFlex">
        {boardData.map((data, index) => (
          <BoardBox
            key={index}
            boardTitle={data.boardName}
            notices={data.posts.map((post) => post.title)}
            date={
              data.posts.length > 0
                ? new Date(data.posts[0].createdAt).toLocaleDateString()
                : ""
            }
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
