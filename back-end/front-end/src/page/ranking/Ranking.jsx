// Ranking.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import RankingList from "./RankingList";
import { useNavigate, useLocation } from "react-router-dom";
import "./ranking.scss";

const Ranking = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [rankings, setRankings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const location = useLocation();

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
        console.log(1);
        const isRankingPage = location.pathname === "/ranking";
        const visibleRankings = response.data.filter(
          (r) => isRankingPage || [1, 2, 3].includes(r.show_number)
        );
        setRankings(visibleRankings);
      } catch (error) {
        console.error("랭킹 설정을 가져오는 중 오류 발생:", error);
      }
    };

    fetchRankingSettings();
  }, [location.pathname]); // location.pathname에 의존성을 명확히 설정

  return (
    <div
      className="container ranking-container"
      onClick={() => navigate("/ranking")}
    >
      <TitleBox title="랭킹" />
      {location.pathname === "/ranking" && (
        <div className="filters">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {[...Array(12)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}월
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="rankingInner">
        {rankings.map((ranking) => (
          <RankingList
            key={ranking.id}
            title={ranking.name}
            filterNumber={ranking.filter_number}
            api_name={ranking.api_name}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        ))}
      </div>
    </div>
  );
};

export default Ranking;
