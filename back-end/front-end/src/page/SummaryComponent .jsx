import React, { useState } from "react";
import axios from "axios";

const SummaryComponent = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/summary/${startDate}/${endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching summary data:", error);
      setError("Error fetching summary data");
      setData(null);
    }
  };

  return (
    <div>
      <h1>요약 데이터</h1>
      <div>
        <label>
          시작 날짜:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          종료 날짜:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <button onClick={fetchData}>데이터 가져오기</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div>
          <h2>총 데이터</h2>
          <p>총 작업 시간(초): {data.totalWorkingHours}</p>
          <p>총 주행 거리(킬로미터): {data.totalDrivingDistance}</p>
          <p>총 영업 거리(킬로미터): {data.totalBusinessDistance}</p>
          <p>총 영업 비율(%): {data.totalBusinessRate}</p>
          <p>총 연료 소모량(리터): {data.totalFuelAmount}</p>
          <p>총 연비(킬로미터/리터): {data.totalFuelEfficiency}</p>
          <p>총 운전 횟수: {data.totalDrivingCases}</p>
          <p>시간당 총 수입(원): {data.totalIncomePerHour}</p>
          <p>킬로미터당 총 수입(원): {data.totalIncomePerKm}</p>

          <h2>오늘 데이터</h2>
          <p>오늘 작업 시간(초): {data.todayWorkingHours}</p>
          <p>오늘 주행 거리(킬로미터): {data.todayDrivingDistance}</p>
          <p>오늘 영업 거리(킬로미터): {data.todayBusinessDistance}</p>
          <p>오늘 영업 비율(%): {data.todayBusinessRate}</p>
          <p>오늘 연료 소모량(리터): {data.todayFuelAmount}</p>
          <p>오늘 연비(킬로미터/리터): {data.todayFuelEfficiency}</p>
          <p>오늘 운전 횟수: {data.todayDrivingCases}</p>
          <p>시간당 오늘 수입(원): {data.todayIncomePerHour}</p>
          <p>킬로미터당 오늘 수입(원): {data.todayIncomePerKm}</p>

          <h2>상위 퍼센티지</h2>
          <p>작업 시간 상위 퍼센티지(%): {data.workingHoursPercentage}%</p>
          <p>주행 거리 상위 퍼센티지(%): {data.drivingDistancePercentage}%</p>
          <p>영업 거리 상위 퍼센티지(%): {data.businessDistancePercentage}%</p>
          <p>영업 비율 상위 퍼센티지(%): {data.businessRatePercentage}%</p>
          <p>연료 소모량 상위 퍼센티지(%): {data.fuelAmountPercentage}%</p>
          <p>연비 상위 퍼센티지(%): {data.fuelEfficiencyPercentage}%</p>
          <p>운전 횟수 상위 퍼센티지(%): {data.drivingCasesPercentage}%</p>
          <p>시간당 수입 상위 퍼센티지(%): {data.incomePerHourPercentage}%</p>
          <p>킬로미터당 수입 상위 퍼센티지(%): {data.incomePerKmPercentage}%</p>
        </div>
      )}
    </div>
  );
};

export default SummaryComponent;
