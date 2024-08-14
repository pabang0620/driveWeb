import React, { useEffect, useState, Component } from "react";
import Dashboard from "../../components/Dashboard";
import CircularChart from "../../components/CircularChart";
import MixChart from "../../components/MixChart";
import Calendar from "../../components/Calendar";
import SummaryComponent from "../SummaryComponent ";
import DriveDateRangeDashBoard from "./DriveDateRangeDashBoard";

const DriveDashBoard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const onDateChange = (update) => {
    let startDate = update[0];
    let endDate = update[1] || update[0]; // endDate가 없으면 startDate와 동일하게 설정
    handleDateChange({ startDate, endDate });
  };

  const getDateOffset = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    // UTC 시간에서 9시간을 더해 한국 시간으로 변경
    const koreanTimeOffset = date.getTime() + 9 * 60 * 60 * 1000;
    const koreanDate = new Date(koreanTimeOffset);

    return koreanDate.toISOString().split("T")[0];
  };

  const handleDateChange = (range) => {
    const { startDate, endDate } = range;
    setDateRange({ startDate, endDate });
  };

  const getDate = () => {
    const startDate = getDateOffset(0, dateRange.startDate);
    const endDate = getDateOffset(0, dateRange.endDate);
    console.log(`Selected Date Range (Frontend): ${startDate} - ${endDate}`);
    return { startDate, endDate };
  };

  useEffect(() => {
    const dates = getDate();
    console.log("Date range updated:", dates);
    // 여기에 API 호출 등을 추가할 수 있습니다.
  }, [dateRange]);

  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="container dashboard-container">
      <h2 className="mainTitle">
        운행일지 <span>대쉬보드</span>
      </h2>

      <div className="dataBox">
        <div className="selectedDateRangeDataBox">
          <h3>기간별 세부 데이터</h3>
          <div>
            <Calendar
              dateRange={dateRange}
              handleDateChange={handleDateChange}
            />
            <DriveDateRangeDashBoard dateRange={dateRange} />
          </div>
        </div>

        <CircularChart
          dateRange={dateRange}
          setLoading={setLoading}
          setError={setError}
          title={"수입차트"}
          url={"incomeSummary"}
        />
        <CircularChart
          dateRange={dateRange}
          setLoading={setLoading}
          setError={setError}
          title={"지출차트"}
          url={"expenseSummary"}
        />
        <MixChart
          dateRange={dateRange}
          setLoading={setLoading}
          setError={setError}
          title={"혼합차트"}
        />
      </div>
      <style jsx>{`
        .dashboard-container {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          height: auto;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
          h2.mainTitle {
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
          h3 {
            width: 100%;
            text-align: left;
          }
          .selectedDateRangeDataBox {
            width: 100%;
            > div {
              width: 100%;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: space-between;
              align-items: flex-start;
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

export default DriveDashBoard;
