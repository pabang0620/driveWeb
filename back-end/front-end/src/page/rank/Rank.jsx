import React, { useState, useEffect } from "react";
import axios from "axios";

const Rank = () => {
  const [fuelType, setFuelType] = useState("전체");
  const [jobType, setJobType] = useState(0);
  const [fuelEfficiencyRanks, setFuelEfficiencyRanks] = useState([]);
  const [workingHoursRanks, setWorkingHoursRanks] = useState([]);

  useEffect(() => {
    const fetchFuelEfficiencyRanks = async () => {
      try {
        const response = await axios.get(
          `/api/rank/fuel-efficiency/${fuelType}`
        );
        if (Array.isArray(response.data)) {
          setFuelEfficiencyRanks(response.data);
        } else {
          console.error("Unexpected response data:", response.data);
          setFuelEfficiencyRanks([]);
        }
      } catch (error) {
        console.error("연비 랭킹 데이터를 가져오는 중 오류 발생:", error);
        setFuelEfficiencyRanks([]);
      }
    };

    fetchFuelEfficiencyRanks();
  }, [fuelType]);

  useEffect(() => {
    const fetchWorkingHoursRanks = async () => {
      try {
        const response = await axios.get(`/api/rank/working-hours/${jobType}`);
        if (Array.isArray(response.data)) {
          setWorkingHoursRanks(response.data);
        } else {
          console.error("Unexpected response data:", response.data);
          setWorkingHoursRanks([]);
        }
      } catch (error) {
        console.error("운행시간 랭킹 데이터를 가져오는 중 오류 발생:", error);
        setWorkingHoursRanks([]);
      }
    };

    fetchWorkingHoursRanks();
  }, [jobType]);

  return (
    <div className="rank-container">
      <h1>랭킹</h1>

      <div className="ranking-section">
        <h2>연비 랭킹</h2>
        <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
          <option value="전체">전체</option>
          <option value="LPG">LPG</option>
          <option value="전기">전기</option>
          <option value="휘발유">휘발유</option>
          <option value="기타">기타</option>
        </select>
        <ul>
          {fuelEfficiencyRanks.map((rank, index) => (
            <li key={rank.id} className="rank-item">
              {index + 1}. {rank.driving_logs.users.nickname} - 연비:{" "}
              {rank.fuel_efficiency} km/l
            </li>
          ))}
        </ul>
      </div>

      <div className="ranking-section">
        <h2>운행시간 랭킹</h2>
        <select
          value={jobType}
          onChange={(e) => setJobType(parseInt(e.target.value, 10))}
        >
          <option value={0}>전체</option>
          <option value={1}>택시</option>
          <option value={2}>배달</option>
          <option value={3}>기타</option>
        </select>
        <ul>
          {workingHoursRanks.map((rank, index) => (
            <li key={rank.id} className="rank-item">
              {index + 1}. {rank.driving_logs.users.nickname} - 운행시간:{" "}
              {rank.working_hours} 시간
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .rank-container {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        .ranking-section {
          margin-bottom: 40px;
        }
        h2 {
          color: #333;
        }
        select {
          margin-bottom: 20px;
          padding: 5px;
          font-size: 16px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        .rank-item {
          background: #f9f9f9;
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .rank-item:nth-child(odd) {
          background: #ececec;
        }
      `}</style>
    </div>
  );
};

export default Rank;
