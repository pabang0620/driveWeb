import TitleBox from "../../components/TitleBox";
import BoardBox from "./BoardBox";

const Board = () => {
  const boardData = [
    {
      title: "공지사항",
      notices: Array(10).fill("공지사항 내용 1"),
      date: "2024.06.12.",
    },
    {
      title: "자유게시판",
      notices: Array(10).fill("자유게시판 내용 2"),
      date: "2024.06.13.",
    },
    {
      title: "갤러리 게시판",
      notices: Array(10).fill("갤러리 내용 3"),
      date: "2024.06.14.",
    },
  ];

  return (
    <div className="board">
      <TitleBox title="게시판" subtitle=" 전체" />
      <div className="boardFlex">
        {boardData.map((data, index) => (
          <BoardBox
            key={index}
            boardTitle={data.title}
            notices={data.notices}
            date={data.date}
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
