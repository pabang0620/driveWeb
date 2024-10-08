import React from "react";

const Banner = () => {
  return (
    <div className="main_banner">
      <div className="banner_text">
        <h3>당신의 안전한 운행을 위한 최고의 기록 도구</h3>
        <h2>
          손쉽게, 더 효율적으로
          <br />
          기록하자
        </h2>
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
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;
