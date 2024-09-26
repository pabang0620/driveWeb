import "./components.scss";

const TitleBox = ({ title, subtitle }) => {
  return (
    <h2 className="mainTitle">
      {title}
      <span className="subTitle">{subtitle}</span>
    </h2>
  );
};
export default TitleBox;
