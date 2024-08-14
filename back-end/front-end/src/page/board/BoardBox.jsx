import { useNavigate } from "react-router-dom";
import dummyboardData from "../../components/dummy";
const BoardBox = ({ boardTitle, notices }) => {
  const navigate = useNavigate();

  const handleNoticeClick = (id) => {
    navigate(`/board/post/${id}`);
  };

  return (
    <div className="boardBox">
      <div className="boardBoxheader">{boardTitle}</div>
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
      <style jsx>{`
        .boardBox {
          width: 47%;
          padding: 10px 20px;
          background: #fff;
          border: 10px solid #e0e0e0;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          @media (max-width: 768px) {
            width: 100%;
          }
          .boardBoxnotice:not(:last-of-type) {
            border-bottom: 1px solid #e0e0e0;
          }
        }
        .boardBoxheader {
          font-size: 20px;
          font-weight: bold;
          margin: 5px 0;
          @media (max-width: 768px) {
            font-size: 18px;
          }
        }
        .boardBoxnotice {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          font-size: 15px;
          cursor: pointer;
          @media (max-width: 768px) {
            padding: 5px 0;
            font-size: 14px;
          }
        }
        .boardBoxnotice:last-child {
          border-bottom: none;
        }
        .indexBox {
          background-color: #05aced;
          color: #fff;
          padding: 3px 7px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .noticeTitle {
          flex: 1;
          margin-left: 10px;
        }
        .noticeDate {
          margin-left: 10px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default BoardBox;
