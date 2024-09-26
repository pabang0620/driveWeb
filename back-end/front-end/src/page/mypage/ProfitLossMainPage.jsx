// ProfitLossMainPage.js

import React, { useEffect, useState } from "react";
import YearlyView from "./YearlyView";
import MonthlyView from "./MonthlyView";
import QuarterlyView from "./QuarterlyView";
import TitleBox from "../../components/TitleBox";
import { useNavigate } from "react-router-dom";
import useCheckPermission from "../../utils/useCheckPermission";
import "./mypage.scss";

function ProfitLossMainPage() {
  //useCheckPermission();

  const [viewMode, setViewMode] = useState("year");
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  useEffect(() => {
    const handleScroll = () => {
      // 페이지의 총 높이
      const documentHeight = document.documentElement.scrollHeight;
      // 현재 스크롤 위치
      const scrollPosition = window.scrollY + window.innerHeight;

      // 페이지 하단에 도달했는지 확인
      if (scrollPosition <= documentHeight - 100) {
        setIsVisible(false);
      } else if (scrollPosition >= 0) {
        setIsVisible(true);
      }
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // 부드러운 스크롤 효과
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드러운 스크롤 효과
    });
  };

  return (
    <div className="profitLossContainer">
      <TitleBox title="손익계산서" subtitle="프리미엄 기능 ✨" />
      <div>
        <div className="tapGroup">
          <button
            className={viewMode === "year" ? "active" : ""}
            onClick={() => handleViewModeChange("year")}
          >
            년별
          </button>
          <button
            className={viewMode === "month" ? "active" : ""}
            onClick={() => handleViewModeChange("month")}
          >
            월별
          </button>
          <button
            className={viewMode === "quarter" ? "active" : ""}
            onClick={() => handleViewModeChange("quarter")}
          >
            분기별
          </button>
        </div>

        {viewMode === "year" && <YearlyView />}
        {viewMode === "month" && <MonthlyView />}
        {viewMode === "quarter" && <QuarterlyView />}
      </div>
      <button
        className={`scrollBtn ${
          isVisible ? "topScrollBtn" : "bottonScrollBtn"
        }`}
        onClick={isVisible ? scrollToTop : scrollToBottom}
      >
        <img
          src={`${process.env.PUBLIC_URL}/images/prevBtn.png`}
          alt="스크롤이동"
        />
      </button>
      <div className="btnBox">
        <button className="backButton" onClick={() => navigate("/mypage")}>
          <span>
            <img
              src={`${process.env.PUBLIC_URL}/images/prevBtn.png`}
              alt="이전"
            />
          </span>
          마이페이지로 이동
        </button>
        <button onClick={() => navigate("/estimated-income-tax")}>
          예상 종합소득세 조회 <span>ℹ️</span>
        </button>
      </div>
    </div>
  );
}

export default ProfitLossMainPage;
