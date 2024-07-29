import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import CircularChart from "./CircularChart";
import MixChart from "./MixChart";

const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("today"); // "yesterday", "dayBeforeYesterday"

  const getDateOffset = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    // UTC 시간에서 9시간을 더해 한국 시간으로 변경
    const koreanTimeOffset = date.getTime() + 9 * 60 * 60 * 1000;
    const koreanDate = new Date(koreanTimeOffset);

    return koreanDate.toISOString().split("T")[0];
  };

  const dateOffsets = {
    dayBeforeYesterday: -2,
    yesterday: -1,
    today: 0,
  };

  const getDate = () => {
    const offset = dateOffsets[dateRange];
    const date = getDateOffset(offset);
    console.log(`Selected Date (Frontend): ${date}`);
    return date;
  };

  const handleDateChange = (range) => {
    setDateRange(range);
  };

  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="container mypage-container">
      <h2>마이페이지</h2>

      <select
        className="dateSelector"
        onChange={(e) => handleDateChange(e.target.value)}
      >
        <option value="today">오늘</option>
        <option value="yesterday">어제</option>
        <option value="dayBeforeYesterday">그제</option>
      </select>
      <div className="dataBox">
        <Dashboard
          dateRange={dateRange}
          getDate={getDate}
          setLoading={setLoading}
          setError={setError}
        />
        <CircularChart
          dateRange={dateRange}
          getDate={getDate}
          setLoading={setLoading}
          setError={setError}
          title={"수입차트"}
          url={"incomeSummary"}
        />
        <CircularChart
          dateRange={dateRange}
          getDate={getDate}
          setLoading={setLoading}
          setError={setError}
          title={"지출차트"}
          url={"expenseSummary"}
        />
        <MixChart
          dateRange={dateRange}
          getDate={getDate}
          setLoading={setLoading}
          setError={setError}
          title={"혼합차트"}
        />
      </div>
      <style jsx>{`
        .mypage-container {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          height: auto;
          h2 {
            font-size: 25px;
            font-weight: 600;
            margin-bottom: 30px;
            float: left;
            span {
              font-size: 20px;
              color: #4c4c4c;
              margin-left: 10px;
            }
          }
          .dateSelector {
            float: right;
            cursor: pointer;
            font-size: 14px;
            padding: 5px;
            width: 10vw;
            border-radius: 5px;
            option {
              padding: 10px;
              cursor: pointer;
            }
          }

          .dataBox {
            width: 100%;
            height: auto;
            clear: both;
            background-color: #f0f0f0;
            padding: 2% 2% 7% 2%;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: space-between;
            h3 {
              margin-bottom: 10px;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default MyPage;
