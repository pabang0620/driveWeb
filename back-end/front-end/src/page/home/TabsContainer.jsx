import React from "react";
import TopRankList from "./TopRankList";

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
      <style jsx>{`
        .tabsContainer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          @media (max-width: 768px) {
            flex-direction: column;
            gap: 15px;
          }
          .leftTabs,
          .rightTabs {
            width: 45%;
            @media (max-width: 768px) {
              width: 100%;
            }
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
                padding: 10px 5px;
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

export default TabsContainer;
