import React, { useEffect, useState, Component } from "react";
import Dashboard from "../../components/Dashboard";
import CircularChart from "../../components/CircularChart";
import MixChart from "../../components/MixChart";
import Calendar from "../../components/Calendar";
import SummaryComponent from "../SummaryComponent ";
import DriveDateRangeDashBoard from "./DriveDateRangeDashBoard";
import { jwtDecode } from "jwt-decode";
import PremiumButton from "../admin/PremiumButton ";
import useCheckPermission from "../../utils/useCheckPermission";
import { getJobtype, getProfileVehicle } from "../../components/ApiGet";
import { Link } from "react-router-dom";
import "./drive.scss";

const DriveDashBoard = () => {
  useCheckPermission();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), // 한 달 전
    endDate: new Date(), // 오늘
  });
  const [datepermission, setdatePermission] = useState(null); // 권한 상태

  const [isBlurred, setIsBlurred] = useState(false);
  // -----------------------------------------------------
  const [vehicleInfo, setVehicleInfo] = useState({
    carType: "", // 차량종류
    franchise_status: "", // 가맹상태
    vehicle_name: "", // 차량 이름
    year: 0, // 연식
    fuel_type: "", // 연료유형
    mileage: 0, // 누적거리
  });
  // 회원정보 불러오기
  useEffect(() => {
    const getUserData = async () => {
      try {
        const vehicleData = await getProfileVehicle();
        console.log("Vehicle Data:", vehicleData);
        setVehicleInfo(vehicleData);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUserData();
  }, []);

  // ---------------------------------------
  useEffect(() => {
    // 토큰에서 permission 값을 가져와 확인
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { permission } = decodedToken;
        console.log(permission);
        setdatePermission(permission); // 권한 값을 상태에 저장

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
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // 권한이 5인 경우 한 달 이상 범위 선택을 제한
    if (datepermission === 5) {
      // 선택된 시작 날짜가 한 달 이전이거나 종료 날짜가 오늘 이후인 경우
      if (startDate < oneMonthAgo || endDate > today) {
        alert("프리미엄 기능입니다. 한 달 이상의 기간을 선택할 수 없습니다.");
        return; // 날짜 범위를 업데이트하지 않음
      }
    }

    // 유효한 경우에만 날짜 범위를 업데이트
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

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error loading data: {error.message}</p>;
  if (!vehicleInfo.carType) {
    // 차량 종류가 비어있을 경우 메시지 표시
    return (
      <div className="container">
        <Link to="/user/carInfo">차량 정보를 입력해주세요(클릭 시 이동)</Link>
      </div>
    );
  }
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
            <DriveDateRangeDashBoard
              dateRange={dateRange}
              isBlurred={isBlurred}
              datepermission={datepermission}
              handleDateChange={handleDateChange}
            />
          </div>
        </div>

        <CircularChart
          dateRange={dateRange}
          setLoading={setLoading}
          setError={setError}
          title={"수입차트"}
          url={"incomeSummary"}
          isBlurred={isBlurred}
        />
        <CircularChart
          dateRange={dateRange}
          setLoading={setLoading}
          setError={setError}
          title={"지출차트"}
          url={"expenseSummary"}
          isBlurred={isBlurred}
        />
        <MixChart
          dateRange={dateRange}
          setLoading={setLoading}
          setError={setError}
          title={"혼합차트"}
          isBlurred={isBlurred}
        />
        <PremiumButton />
      </div>
    </div>
  );
};

export default DriveDashBoard;
