import React, { useEffect, useState } from "react";
import axios from "axios";
import RankingList from "../ranking/RankingList";
import NoticeZone from "./NoticeZone";
import TopRankList from "./TopRankList";
import Banner from "./Banner";
import TabsContainer from "./TabsContainer";
import { useNavigate, useLocation } from "react-router-dom";
import "./home.scss";

function Home() {
  const navigate = useNavigate();
  const [boardsWithPosts, setBoardsWithPosts] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [activeLeftTab, setActiveLeftTab] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // ----------------------------랭킹
  const [rankings, setRankings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const location = useLocation();
  // 모바일 확인 ---------------------------------------------------------------------------------------------

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // 모바일 확인

  useEffect(() => {
    // 현재 날짜 기준으로 이번 달을 기본 값으로 설정
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
    setSelectedMonth(currentMonth);
  }, []);

  useEffect(() => {
    const fetchRankingSettings = async () => {
      try {
        const response = await axios.get("/api/rank/list");
        const visibleRankings = response.data.filter(
          (r) =>
            r.show_number === 1 || r.show_number === 2 || r.show_number === 3
        );
        setRankings(visibleRankings);
      } catch (error) {
        console.error("랭킹 설정을 가져오는 중 오류 발생:", error);
      }
    };

    fetchRankingSettings();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedRankings = isMobile ? rankings.slice(0, 1) : rankings;

  // ----------------------------랭킹

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

  console.log("sadfasdf", boardsWithPosts);
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
            <div className="rankingList" onClick={() => navigate("/ranking")}>
              {displayedRankings.map((ranking) => (
                <RankingList
                  key={ranking.id}
                  title={ranking.name}
                  filterNumber={ranking.filter_number}
                  api_name={ranking.api_name}
                  selectedMonth={selectedMonth}
                />
              ))}
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
    </div>
  );
}

export default Home;
