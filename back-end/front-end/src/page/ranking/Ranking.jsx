import TitleBox from "../../components/TitleBox";
import RankingList from "./RankingList";
import { useState, useEffect } from "react";
import axios from "axios";

const Ranking = () => {
  const [rankings, setRankings] = useState([]);

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
  }, []);

  return (
    <div className="container ranking-container">
      <TitleBox title="랭킹" />
      <div className="rankingInner">
        {rankings.map((ranking) => (
          <RankingList
            key={ranking.id}
            title={ranking.name}
            filterNumber={ranking.filter_number}
            api_name={ranking.api_name}
          />
        ))}
      </div>
      <style jsx>{`
        .ranking-container {
          width: 70%;
          padding: 100px 0;
          margin: 0 auto;
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
