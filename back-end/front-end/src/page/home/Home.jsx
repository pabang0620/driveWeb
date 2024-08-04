import React, { useEffect, useState } from "react";
import axios from "axios";
import RankingList from "../ranking/RankingList";
import NoticeZone from "./NoticeZone";
import TopRankList from "./TopRankList";

function Home() {
  const [boardsWithPosts, setBoardsWithPosts] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [activeLeftTab, setActiveLeftTab] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRank = async () => {
      try {
        const response = await axios.get("/api/rank/topRank");
        setBoardsWithPosts(response.data.boardsWithPosts);
        setTopViewedPosts(response.data.topViewedPosts);
        setTopLikedPosts(response.data.topLikedPosts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTopRank();
  }, []);

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
        <NoticeZone boardsWithPosts={boardsWithPosts} />
        <div className="rankingList">
          <RankingList title={"연비"} rankType={"fuelType"} />
          <RankingList title={"운행시간"} rankType={"jobType"} />
          <RankingList title={"총 운송수입금"} rankType={"carType"} />
        </div>
        <div className="topRank">
          <div className="tabsContainer">
            <div className="leftTabs">
              <div className="tabList">
                {boardsWithPosts.map((board, index) => (
                  <button
                    key={board.id}
                    onClick={() => setActiveLeftTab(index)}
                    className={activeLeftTab === index ? "active" : ""}
                  >
                    {board.name}
                  </button>
                ))}
              </div>
              <TopRankList
                posts={
                  boardsWithPosts[activeLeftTab]
                    ? boardsWithPosts[activeLeftTab].posts
                    : []
                }
              />
            </div>
            <div className="rightTabs">
              <div className="tabList">
                <button
                  onClick={() => setActiveRightTab(0)}
                  className={activeRightTab === 0 ? "active" : ""}
                >
                  Top Viewed Posts
                </button>
                <button
                  onClick={() => setActiveRightTab(1)}
                  className={activeRightTab === 1 ? "active" : ""}
                >
                  Top Liked Posts
                </button>
              </div>
              <TopRankList
                posts={activeRightTab === 0 ? topViewedPosts : topLikedPosts}
              />
            </div>
          </div>
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
            margin: 50px auto;
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            gap: 50px;
            .rankingList {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
            }
            .topRank {
              width: 100%;
              .tabsContainer {
                display: flex;
                justify-content: space-between;
              }
              .leftTabs,
              .rightTabs {
                width: 45%;
                .tabList {
                  display: flex;
                  justify-content: center;
                  background-color: #f0f3f5;
                  border-radius: 5px;
                  overflow: hidden;
                  button:not(:last-of-type) {
                    border-right: 1px solid #ddd;
                  }
                  button {
                    padding: 10px 20px;
                    cursor: pointer;
                    flex: 1;
                    font-weight: bold;
                    &.active {
                      font-weight: bold;
                      background-color: #05aced;
                      color: white;
                      border: none;
                    }
                  }
                }
              }
            }
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
