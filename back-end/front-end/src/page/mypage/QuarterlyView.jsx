// QuarterlyView.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";

function QuarterlyView() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState("1");
  const [data, setData] = useState({ income: [], expense: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        console.log("Fetching quarterly data for:", year, quarter);

        const response = await api.get(
          `/tax/profitLossStatement/quarterly/${year}/${quarter}`
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, quarter]);

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
  };

  const handleQuarterChange = (event) => {
    setQuarter(event.target.value);
  };

  const formatCurrency = (value) => {
    return `${Math.round(value).toLocaleString()}원`;
  };

  const quarterNames = {
    1: "1분기 (1월~3월)",
    2: "2분기 (4월~6월)",
    3: "3분기 (7월~9월)",
    4: "4분기 (10월~12월)",
  };

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="quarterlyView">
      <TitleBox title="프리미엄 기능" subtitle="분기별 손익계산서" />
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
          <span>분기 선택</span>
          <select value={quarter} onChange={handleQuarterChange}>
            <option value="1">1분기 (1월~3월)</option>
            <option value="2">2분기 (4월~6월)</option>
            <option value="3">3분기 (7월~9월)</option>
            <option value="4">4분기 (10월~12월)</option>
          </select>
        </label>
      </div>
      <div className="result">
        <div className="section">
          <h3>
            {year}년 {quarterNames[quarter]} 수익 및 지출
          </h3>
          <div>
            <span>수익 합계:</span>{" "}
            <span>{formatCurrency(data.income.total)}</span>
          </div>
          <div>
            <span>지출 합계:</span>{" "}
            <span>{formatCurrency(data.expense.total)}</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .quarterlyView {
          padding: 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
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
        .section div {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        .section div:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}

export default QuarterlyView;
