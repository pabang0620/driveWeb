// ProfitLossMainPage.js

import React, { useState } from "react";
import YearlyView from "./YearlyView";
import MonthlyView from "./MonthlyView";
import QuarterlyView from "./QuarterlyView";
import TitleBox from "../../components/TitleBox";

function ProfitLossMainPage() {
  const [viewMode, setViewMode] = useState("year");

  const handleViewModeChange = (event) => {
    setViewMode(event.target.value);
  };

  return (
    <div className="profitLossContainer">
      <TitleBox title="프리미엄 기능" subtitle="손익계산서" />

      <div className="filterGroup">
        <label>
          <span>보기 형식</span>
          <select value={viewMode} onChange={handleViewModeChange}>
            <option value="year">년별</option>
            <option value="month">월별</option>
            <option value="quarter">분기별</option>
          </select>
        </label>
      </div>

      {viewMode === "year" && <YearlyView />}
      {viewMode === "month" && <MonthlyView />}
      {viewMode === "quarter" && <QuarterlyView />}

      <style jsx>{`
        .profitLossContainer {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          height: auto;
        }
        .filterGroup {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 20px;
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
      `}</style>
    </div>
  );
}

export default ProfitLossMainPage;
