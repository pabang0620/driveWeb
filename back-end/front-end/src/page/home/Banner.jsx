import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./home.scss";

const Banner = () => {
  const navigate = useNavigate();

  const handleBoardPostClick = () => {
    navigate("/board/post/43");
  };
  return (
    <div className="main_banner" onClick={handleBoardPostClick}>
      <div className="banner_text">
        <h3>당신의 건강한 매출을 위한 최고의 기록 도구</h3>
        <h2>
          손쉽게, 더 효율적으로
          <br />
          기록하자
        </h2>
        <Link to="https://krdriver.com/board/post/43" className="detail_button">
          자세히 보기
        </Link>
      </div>
      <style jsx>{`
        .main_banner {
          background-image: url("/images/home/banner1.png");
        }
      `}</style>
    </div>
  );
};

export default Banner;
