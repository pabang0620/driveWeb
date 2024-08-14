import React, { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard";
import CircularChart from "../../components/CircularChart";
import MixChart from "../../components/MixChart";
import IncomeTaxComponent from "./IncomeTaxComponent";

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
      <div>
        <p className="note">- 프리미엄 기능입니다.</p>
        <div className="subscribeADD">
          <IncomeTaxComponent
            title="예상종합소득세"
            description="운행일지에 입력된 데이터를 바탕으로 예상 종합소득세를 산출하는 기능입니다."
            icon="ℹ️"
            route="/estimated-income-tax"
          />
          <IncomeTaxComponent
            title="손익계산서 조회"
            description="회계 데이터를 기반으로 손익계산서를 조회하는 서비스입니다."
            icon="📊"
            route="/profit-loss-statement"
          />
        </div>
      </div>

      <style jsx>{`
        .mypage-container {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          height: auto;
          .note {
            margin-top: 80px;
          }
          .subscribeADD {
            display: flex;
            flex-direction: row;
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
