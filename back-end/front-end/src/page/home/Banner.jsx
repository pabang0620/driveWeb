import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
          width: 100%;
          height: 350px;
          background-image: url("/images/home/banner1.png");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          cursor: pointer;
          @media (max-width: 768px) {
            background-position: 85%;
          }
          @media (max-width: 480px) {
            height: 200px;
            background-position: 80%;
          }
          .banner_text {
            width: 80%;
            margin: 0 auto;
            max-width: 1200px;
            color: white;
            text-shadow: 1.5px 1.5px 1.5px rgba(0, 0, 0, 0.5);
            h3 {
              font-size: 20px;
              color: white;
            }
            h2 {
              margin-top: 10px;
              margin-bottom: 20px;
              font-size: 40px;
              color: white;
            }
            @media (max-width: 768px) {
              h3 {
                font-size: 6.5vw;
              }
              h2 {
                font-size: 4.5vw;
              }
            }

            .detail_button {
              padding: 8px 10px;
              font-size: 13px;
              color: white;
              background-color: #3c5997;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              text-shadow: none;
              @media (max-width: 768px) {
                font-size: 11px;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;
