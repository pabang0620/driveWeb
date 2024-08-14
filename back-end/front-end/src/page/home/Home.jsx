import React, { useEffect, useState } from "react";
import axios from "axios";
import RankingList from "../ranking/RankingList";
import NoticeZone from "./NoticeZone";
import TopRankList from "./TopRankList";
import Banner from "./Banner";
import TabsContainer from "./TabsContainer";
import {
  boardsWithPosts,
  topViewedPosts,
  topLikedPosts,
} from "../../components/dummy";
function Home() {
  // const [boardsWithPosts, setBoardsWithPosts] = useState([]);
  // const [topViewedPosts, setTopViewedPosts] = useState([]);
  // const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [activeLeftTab, setActiveLeftTab] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchTopRank = async () => {
  //     try {
  //       const response = await axios.get("/api/rank/topRank");
  //       setBoardsWithPosts(response.data.boardsWithPosts);
  //       setTopViewedPosts(response.data.topViewedPosts);
  //       setTopLikedPosts(response.data.topLikedPosts);
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchTopRank();
  // }, []);

  return (
    <div className="home-container">
      <Banner />
      <div className="contents_inner">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <NoticeZone boardsWithPosts={boardsWithPosts} />
            <div className="rankingList">
              <RankingList title={"연비"} rankType={"fuelType"} />
              <RankingList title={"운행시간"} rankType={"jobType"} />
              <RankingList title={"총 운송수입금"} rankType={"carType"} />
            </div>
            <TabsContainer
              boardsWithPosts={boardsWithPosts}
              topViewedPosts={topViewedPosts}
              topLikedPosts={topLikedPosts}
              activeLeftTab={activeLeftTab}
              setActiveLeftTab={setActiveLeftTab}
              activeRightTab={activeRightTab}
              setActiveRightTab={setActiveRightTab}
            />
          </>
        )}
      </div>
      <div className="contents_inner">
        <div className="rankingList">
          <RankingList
            title={"연비"}
            rankType={"jobType"}
            options={["전체", "LPG", "전기", "휘발유", "기타"]}
          />
          <RankingList
            title={"운행시간"}
            rankType={"carType"}
            options={["전체직종", "택시", "배달", "기타"]}
          />
          <RankingList
            title={"총 운송수입금"}
            rankType={"fuelType"}
            options={[]}
          />
        </div>
      </div>
      <style jsx>{`
        .home-container {
          .contents_inner {
            width: 70%;
            margin: 50px auto;
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            gap: 50px;
            @media (max-width: 768px) {
              width: 90%;
              margin: 30px auto;
              gap: 30px;
            }
            .rankingList {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
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
