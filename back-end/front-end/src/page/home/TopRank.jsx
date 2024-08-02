import React, { useState, useEffect } from "react";
import axios from "axios";
import TopRankList from "./TopRankList"; // 새로운 컴포넌트를 임포트합니다.
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TopRank = () => {
  const [boardsWithPosts, setBoardsWithPosts] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [activeLeftTab, setActiveLeftTab] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="topRank">
      <div className="noticeZone">
        <Slider {...settings}>
          {boardsWithPosts[1]?.posts.map((post, index) => (
            <div key={index}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </Slider>
      </div>
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
      <style jsx>{`
        .topRank {
          width: 100%;
          .noticeZone {
            width: 1100px;
            height: 100px;
            background-color: #f0f3f5;
            border-radius: 5px;
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateY(-50);
          }
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
      `}</style>
    </div>
  );
};

export default TopRank;
