import React from "react";
import TopRankList from "./TopRankList";
import "./home.scss";

const TabsContainer = ({
  boardsWithPosts,
  topViewedPosts,
  topLikedPosts,
  activeLeftTab,
  setActiveLeftTab,
  activeRightTab,
  setActiveRightTab,
}) => {
  return (
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
              조회 수
            </button>
            <button
              onClick={() => setActiveRightTab(1)}
              className={activeRightTab === 1 ? "active" : ""}
            >
              좋아요 수
            </button>
          </div>
          <TopRankList
            posts={activeRightTab === 0 ? topViewedPosts : topLikedPosts}
          />
        </div>
      </div>
    </div>
  );
};

export default TabsContainer;
