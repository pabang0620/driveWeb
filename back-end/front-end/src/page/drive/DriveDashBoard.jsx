import React, { useEffect, useState, Component } from "react";
import Dashboard from "../../components/Dashboard";
import CircularChart from "../../components/CircularChart";
import MixChart from "../../components/MixChart";
import Calendar from "../../components/Calendar";

const DriveDashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [dateRange, setDateRange] = useState("today"); // "yesterday", "dayBeforeYesterday"
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleChange = (dates) => {
    const [start, end] = dates;
    setDateRange({ startDate: start, endDate: end });
  };

  const formatDate = (date) => {
    return date ? date.toISOString().split("T")[0] : "";
  };

  const getDateRange = () => {
    return {
      start: formatDate(dateRange.startDate),
      end: formatDate(dateRange.endDate),
    };
  };

  // const getDateOffset = (offset) => {
  //   const date = new Date();
  //   date.setDate(date.getDate() + offset);
  //   return date.toISOString().split("T")[0];
  // };

  // const dateOffsets = {
  //   dayBeforeYesterday: -2,
  //   yesterday: -1,
  //   today: 0,
  // };

  // const getDate = () => {
  //   const offset = dateOffsets[dateRange];
  //   return getDateOffset(offset);
  // };

  // const handleDateChange = (range) => {
  //   setDateRange(range);
  // };

  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="container dashboard-container">
      <h2 className="mainTitle">
        운행일지 <span>대쉬보드</span>
      </h2>

      <div className="dataBox">
        <Calendar dateRange={dateRange} handleChange={handleChange} />
        <div className="selectedDateRangeData">
          <h3>기간별 세부 데이터</h3>
          <Dashboard
            dateRange={getDateRange()}
            setLoading={setLoading}
            handleChange={handleChange}
            setError={setError}
          />
          <div className="selectedData"></div>
        </div>
        <CircularChart
          dateRange={getDateRange()}
          setLoading={setLoading}
          setError={setError}
          title={"수입차트"}
          url={"incomeSummary"}
        />
        <CircularChart
          dateRange={getDateRange()}
          setLoading={setLoading}
          setError={setError}
          title={"지출차트"}
          url={"expenseSummary"}
        />
        <MixChart
          dateRange={getDateRange()}
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
          .selectedDateRangeData {
            width: 100%;
            display: flex;
            flex-direction: row;

            .selectedData {
              width: 50%;
              background-color: #f0f0f0;
              padding: 2% 2% 7% 2%;
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
