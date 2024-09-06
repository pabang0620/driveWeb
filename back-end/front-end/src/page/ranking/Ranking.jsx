// Ranking.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import RankingList from "./RankingList";
import { useNavigate, useLocation } from "react-router-dom";

const Ranking = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [rankings, setRankings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const location = useLocation();

  useEffect(() => {
    // 현재 날짜 기준으로 지난달을 기본 값으로 설정
    const today = new Date();
    const lastMonth = today.getMonth() === 0 ? 12 : today.getMonth();
    setSelectedMonth(lastMonth);
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
      <style jsx>{`
        .ranking-container {
          width: 70%;
          padding: 100px 0;
          margin: 0 auto;
          select {
            padding: 8px 10px;
            font-size: 14px;
            border-radius: 5px;
            border: 1px solid #ccc;
          }
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
          .rankingInner {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            @media (max-width: 1024px) {
              margin-top: 15px;
              gap: 10px;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Ranking;
