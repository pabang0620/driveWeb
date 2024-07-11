const BoardBox = ({ boardTitle, notices, date }) => {
  return (
    <div className="boardBox">
      <div className="boardBoxheader">{boardTitle}</div>
      {notices.map((notice, index) => (
        <div key={index} className="boardBoxnotice">
          <span>
            {index + 1}. {notice}
          </span>
          <span>{date}</span>
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
        }
        .boardBoxheader {
          font-size: 20px;
          font-weight: bold;
          margin: 5px 0;
        }
        .boardBoxnotice {
          display: flex;
          justify-content: space-between;
          padding: 8px 10px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 15px;
        }
        .boardBoxnotice:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default BoardBox;
