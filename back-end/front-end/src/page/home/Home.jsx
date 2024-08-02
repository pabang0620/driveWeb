import React from "react";
import RankingList from "../ranking/RankingList";
import TopRank from "./TopRank";

function Home() {
  return (
    <div className="home-container">
      <div className="main_banner">
        <div className="banner_text">
          <h3>당신의 안전한 운행을 위한 최고의 기록 도구</h3>
          <h2>
            손쉽게, 더 효율적으로
            <br />
            기록하자
          </h2>
        </div>
      </div>
      <div className="contents_inner">
        <div className="rankingList">
          <RankingList title={"연비"} rankType={"fuelType"} />
          <RankingList title={"운행시간"} rankType={"jobType"} />
          <RankingList title={"총 운송수입금"} rankType={"carType"} />
        </div>
        <div>
          <TopRank />
        </div>
      </div>
      <style jsx>{`
        .home-container {
          .main_banner {
            width: 100%;
            height: 350px;
            background-image: url("/images/home/banner1.png");
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
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
            }
          }
          .contents_inner {
            width: 70%;
            margin: 0 auto;
            .rankingList {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
            }
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
