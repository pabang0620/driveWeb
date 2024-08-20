import React, { useEffect, useState } from "react";
import axios from "axios";
import RankingList from "../ranking/RankingList";
import NoticeZone from "./NoticeZone";
import TopRankList from "./TopRankList";
import Banner from "./Banner";
import TabsContainer from "./TabsContainer";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [boardsWithPosts, setBoardsWithPosts] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [activeLeftTab, setActiveLeftTab] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 특정 함수 예시 (실행할 함수)
  const handleAccessToken = async (accessToken) => {
    try {
      console.log("Extracted access token:", accessToken);

      const responseData = await axios.post("/api/social/naver-login", {
        token: accessToken,
      });

      const token = responseData.data.token;
      console.log("JWT Token:", token);
      localStorage.setItem("token", token);

      // 로그인 후 메인 페이지로 이동
      navigate("/"); // 이 부분은 필요에 따라 추가할 수 있습니다.
      // window.location.reload();
    } catch (error) {
      console.error("Naver login error:", error);

      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert(
          `Error: ${error.response.data.error}\nMessage: ${error.response.data.message}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response received from server. Please try again later.");
      } else {
        console.error("Error setting up the request:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        handleAccessToken(accessToken); // 액세스 토큰이 있는 경우 함수 실행
      }
    }

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
            margin: 50px auto;
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
