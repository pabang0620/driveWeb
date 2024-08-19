// ProfitLossMainPage.js

import React, { useEffect, useState } from "react";
import YearlyView from "./YearlyView";
import MonthlyView from "./MonthlyView";
import QuarterlyView from "./QuarterlyView";
import TitleBox from "../../components/TitleBox";
import { useNavigate } from "react-router-dom";
import useCheckPermission from "../../utils/useCheckPermission";

function ProfitLossMainPage() {
  useCheckPermission();

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
      <style jsx>{`
        .profitLossContainer {
          width: 70%;
          max-width: 1200px;
          margin: 100px auto 100px auto;
          height: auto;
          > div {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-top: 20px;
          }
          .tapGroup {
            display: flex;
            justify-content: space-between;
            height: 50px;
            background-color: #fff;
            button {
              flex: 1;
              border: none;
              cursor: pointer;
              font-size: 16px;
              font-weight: 700;
              color: #666;
              transition: background-color 0.3s;
              position: relative;
              &::before {
                content: "";
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 0%;
                width: 1px;
                height: 50%;
                background-color: #ddd;
                z-index: 2;
              }
              &:last-child::before {
                display: none; /* 마지막 버튼의 ::before 제거 */
              }
            }
            button.active {
              color: #05aced;
              &::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 30%;
                height: 3px;
                background-color: #05aced;
              }
            }
            button:hover {
              background-color: #ddd;
            }
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
          .scrollBtn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            position: fixed;
            right: 50px;
            bottom: 100px;
            background-color: #05aced;
            cursor: pointer;
            img {
              width: 40%;
              filter: brightness(0) invert(1);
              z-index: 2;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -40%) rotate(-90deg);
            }
            &.bottonScrollBtn {
              img {
                transform: translate(-50%, -40%) rotate(-90deg);
              }
            }
            &.topScrollBtn {
              img {
                transform: translate(-50%, -55%) rotate(90deg);
              }
            }
          }
          .btnBox {
            width: 100%;
            height: 65px;
            box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
            position: fixed;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: space-between;
            @media (max-width: 1024px) {
              height: 50px;
            }
            button {
              width: 50%;
              height: 100%;
              line-height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 10px;
              height: 100%;
              background-color: white;
              font-size: 14px;
              cursor: pointer;
              @media (max-width: 1024px) {
                font-size: 13px;
              }
              &:nth-of-type(1) {
                span {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background-color: #05aced;
                  position: relative;
                  img {
                    width: 40%;
                    filter: brightness(0) invert(1);
                    z-index: 2;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-55%, -50%);
                  }
                }
              }
              &:nth-of-type(2) {
                border-left: 1px solid #f0f0f0;
              }
            }
          }
        }
      `}</style>
    </div>
  );
}

export default ProfitLossMainPage;
