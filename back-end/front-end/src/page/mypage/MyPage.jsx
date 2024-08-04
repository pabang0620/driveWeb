import React, { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard";
import CircularChart from "../../components/CircularChart";
import MixChart from "../../components/MixChart";
import TitleBox from "../../components/TitleBox";

const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const getDateOffset = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    // UTC 시간에서 9시간을 더해 한국 시간으로 변경
    const koreanTimeOffset = date.getTime() + 9 * 60 * 60 * 1000;
    const koreanDate = new Date(koreanTimeOffset);

    return koreanDate.toISOString().split("T")[0];
  };

  const handleDateChange = (range) => {
    const today = new Date();
    let newStartDate;
    let newEndDate;

    switch (range) {
      case "today":
        newStartDate = today;
        newEndDate = today;
        break;
      case "yesterday":
        newStartDate = new Date(today);
        newStartDate.setDate(today.getDate() - 1);
        newEndDate = newStartDate;
        break;
      case "dayBeforeYesterday":
        newStartDate = new Date(today);
        newStartDate.setDate(today.getDate() - 2);
        newEndDate = newStartDate;
        break;
      default:
        newStartDate = today;
        newEndDate = today;
    }

    setDateRange({ startDate: newStartDate, endDate: newEndDate });
  };

  const getDate = () => {
    const startDate = getDateOffset(0, dateRange.startDate);
    const endDate = getDateOffset(0, dateRange.endDate);
    console.log(`Selected Date Range (Frontend): ${startDate} - ${endDate}`);
    return { startDate, endDate };
  };
  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="container mypage-container">
      <TitleBox title="마이페이지" />
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
          setLoading={setLoading}
          setError={setError}
        />
        <CircularChart
          dateRange={dateRange}
          setError={setError}
          title={"수입차트"}
          url={"incomeSummary"}
        />
        <CircularChart
          dateRange={dateRange}
          title={"지출차트"}
          url={"expenseSummary"}
        />
        <MixChart
          dateRange={dateRange}
          setLoading={setLoading}
          setError={setError}
          title={"혼합차트"}
          url={"getMypageMix"}
        />
      </div>
      <style jsx>{`
        .mypage-container {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          height: auto;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
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
            @media (max-width: 768px) {
              width: 25%;
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
              font-size: 20px;
              @media (max-width: 768px) {
                font-size: 18px;
              }
            }
            @media (max-width: 768px) {
              padding: 5% 5% 20% 5%;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default MyPage;
