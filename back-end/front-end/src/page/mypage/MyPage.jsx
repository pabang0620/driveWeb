import React, { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard";
import CircularChart from "../../components/CircularChart";
import MixChart from "../../components/MixChart";
import TitleBox from "../../components/TitleBox";
import IncomeTaxComponent from "./IncomeTaxComponent"; // 누락된 컴포넌트 임포트 추가
import { jwtDecode } from "jwt-decode";

const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [isBlurred, setIsBlurred] = useState(false);

  const getDateOffset = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    // UTC 시간에서 9시간을 더해 한국 시간으로 변경
    const koreanTimeOffset = date.getTime() + 9 * 60 * 60 * 1000;
    const koreanDate = new Date(koreanTimeOffset);

    return koreanDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    // 토큰에서 permission 값을 가져와 확인
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { permission } = decodedToken;
        console.log(permission);
        // permission이 5인 경우 블러 상태로 설정
        if (permission === 5) {
          setIsBlurred(true);
        } else {
          setIsBlurred(false);
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

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
          title={"수입"}
          url={"incomeSummary"}
          isBlurred={isBlurred}
        />
        <CircularChart
          dateRange={dateRange}
          title={"지출"}
          url={"expenseSummary"}
          isBlurred={isBlurred}
        />
        <MixChart
          dateRange={dateRange}
          setLoading={setLoading}
          setError={setError}
          title={"혼합차트"}
          url={"getMypageMix"}
          isBlurred={isBlurred}
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
            isBlurred={isBlurred}
          />
          <IncomeTaxComponent
            title="손익계산서 조회"
            description="회계 데이터를 기반으로 손익계산서를 조회하는 서비스입니다."
            icon="📊"
            route="/profit-loss-statement"
            isBlurred={isBlurred}
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
            @media (max-width: 768px) {
              flex-direction: column;
            }
          }
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
