// MonthlyView.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";

function MonthlyView() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState("1");
  const [endMonth, setEndMonth] = useState("12");
  const [data, setData] = useState({ income: [], expense: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      console.log("Fetching monthly data for:", year, startMonth, endMonth);

      const response = await api.get(
        `/tax/profitLossStatement/monthly/${year}?startMonth=${startMonth}&endMonth=${endMonth}`
      );
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
  };

  const handleStartMonthChange = (event) => {
    setStartMonth(event.target.value);
  };

  const handleEndMonthChange = (event) => {
    setEndMonth(event.target.value);
  };

  const formatCurrency = (value) => {
    return `${Math.round(value).toLocaleString()}원`;
  };

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  return (
    <div className="monthlyView">
      <TitleBox title="프리미엄 기능" subtitle="월별 손익계산서" />
      <div className="filterGroup">
        <label>
          <span>연도 선택</span>
          <select value={year} onChange={handleYearChange}>
            <option value={2018}>2018</option>
            <option value={2019}>2019</option>
            <option value={2020}>2020</option>
            <option value={2021}>2021</option>
            <option value={2022}>2022</option>
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
          </select>
        </label>
        <label>
          <span>시작 월 선택</span>
          <select value={startMonth} onChange={handleStartMonthChange}>
            {monthNames.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>종료 월 선택</span>
          <select value={endMonth} onChange={handleEndMonthChange}>
            {monthNames.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <button onClick={fetchData}>조회</button>
      </div>
      {loading ? (
        <Spinner />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="result">
          <div className="section">
            <h3>월별 수익 및 지출</h3>
            <div className="row">
              {data.income.map((income, index) => (
                <div key={index} className="column">
                  <h5>{monthNames[parseInt(startMonth, 10) - 1 + index]}</h5>
                  <div>
                    <span>수익:</span>{" "}
                    <span>{formatCurrency(income.total)}</span>
                  </div>
                  <div>
                    <span>지출:</span>{" "}
                    <span>{formatCurrency(data.expense[index].total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .monthlyView {
          padding: 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        .filterGroup {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          gap: 10px;
        }
        label {
          display: flex;
          align-items: center;
        }
        label span {
          margin-right: 10px;
          font-weight: bold;
        }
        select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        button {
          padding: 10px 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #45a049;
        }
        .result {
          display: flex;
          flex-direction: column;
          margin-bottom: 30px;
        }
        .section {
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
        }
        .row {
          display: flex;
          justify-content: space-between;
        }
        .column {
          width: calc(100% / 12 - 10px);
          margin-right: 10px;
        }
        .column:last-child {
          margin-right: 0;
        }
        h5 {
          margin-bottom: 10px;
        }
        .column div {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        .column div:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}

export default MonthlyView;
