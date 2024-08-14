const TitleBox = ({ title, subtitle }) => {
  return (
    <h2 className="mainTitle">
      {title}
      <span className="subTitle">{subtitle}</span>
      <style jsx>{`
        .mainTitle {
          font-size: 25px;
          font-weight: 600;
          .subTitle {
            font-size: 20px;
            color: #4c4c4c;
            margin-left: 10px;
          }
          @media (max-width: 768px) {
            font-size: 20px;
            .subTitle {
              font-size: 15px;
            }
          }
        }
      `}</style>
    </h2>
  );
};
export default TitleBox;
