import { useNavigate } from "react-router-dom";
import dummyboardData from "../../components/dummy";
import "./board.scss";

const BoardBox = ({ boardTitle, notices, boardId }) => {
  const navigate = useNavigate();

  const handleNoticeClick = (id) => {
    navigate(`/board/post/${id}`);
  };

  const handleListClick = () => {
    navigate(`/board/list/${boardId}`);
  };

  return (
    <div className="boardBox">
      <div className="boardBoxheader" onClick={handleListClick}>
        {boardTitle}
      </div>
      {notices.map((notice, index) => (
        <div
          key={index}
          className="boardBoxnotice"
          onClick={() => handleNoticeClick(notice.id)}
        >
          <div className="indexBox">{index + 1}</div>
          <span className="noticeTitle">{notice.title}</span>
          <span className="noticeDate">{notice.date}</span>
        </div>
      ))}
    </div>
  );
};

export default BoardBox;
