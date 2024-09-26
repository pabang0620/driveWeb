import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getDriveDashBoard } from "../../components/ApiGet";
import "./drive.scss";

const DriveDateRangeDashBoard = ({ dateRange, isBlurred }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // 데이터가 업데이트되면 items를 설정
  const getItems = (data) => {
    if (!data) return [];

    const convertSecondsToTime = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600); // 시간 계산
      const minutes = Math.floor((totalSeconds % 3600) / 60); // 분 계산
      const seconds = totalSeconds % 60; // 초 계산

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const items = [
      {
        title: "총 작업 시간",
        value: data.totalWorkingHours
          ? `${convertSecondsToTime(parseInt(data.totalWorkingHours))} (시간)`
          : "0",
        percent: data.workingHoursPercentage
          ? data.workingHoursPercentage.toFixed(2)
          : "0.00",
      },
      {
        title: "총 주행 거리",
        value: data.totalDrivingDistance
          ? `${data.totalDrivingDistance.toFixed(2)} km` // 소수점 2자리까지
          : "0.00 km", // 기본값
        percent: data.drivingDistancePercentage
          ? data.drivingDistancePercentage.toFixed(2)
          : "0.00",
      },
      {
        title: "총 영업 거리",
        value: data.totalBusinessDistance
          ? `${data.totalBusinessDistance.toFixed(2)} km` // 소수점 2자리까지
          : "0.00 km",
        percent: data.businessDistancePercentage
          ? data.businessDistancePercentage.toFixed(2)
          : "0.00",
      },
      {
        title: "총 영업 비율",
        value: data.totalBusinessRate
          ? `${data.totalBusinessRate.toFixed(2)}%` // 소수점 2자리까지
          : "0.00%",
        percent: data.businessRatePercentage
          ? data.businessRatePercentage.toFixed(2)
          : "0.00",
      },
      {
        title: "총 연료 소모량",
        value: data.totalFuelAmount
          ? `${data.totalFuelAmount.toFixed(2)} L` // 소수점 2자리까지
          : "0.00 L",
        percent: data.fuelAmountPercentage
          ? data.fuelAmountPercentage.toFixed(2)
          : "0.00",
      },
      {
        title: "총 연비",
        value: data.totalFuelEfficiency
          ? `${data.totalFuelEfficiency.toFixed(2)} km/L` // 소수점 2자리까지
          : "0.00 km/L",
        percent: data.fuelEfficiencyPercentage
          ? data.fuelEfficiencyPercentage.toFixed(2)
          : "0.00",
      },
      {
        title: "총 운전 횟수",
        value: data.totalDrivingCases ? `${data.totalDrivingCases} 회` : "0 회",
        percent: data.drivingCasesPercentage
          ? data.drivingCasesPercentage.toFixed(2)
          : "0.00",
      },
      {
        title: "시간당 총 수입",
        value: data.totalIncomePerHour
          ? `${data.totalIncomePerHour.toFixed(2)} 원` // 소수점 2자리까지
          : "0.00 원",
        percent: data.incomePerHourPercentage
          ? data.incomePerHourPercentage.toFixed(2)
          : "0.00",
      },
      {
        title: "킬로미터당 총 수입",
        value: data.totalIncomePerKm
          ? `${data.totalIncomePerKm.toFixed(2)} 원` // 소수점 2자리까지
          : "0.00 원",
        percent: data.incomePerKmPercentage
          ? data.incomePerKmPercentage.toFixed(2)
          : "0.00",
      },
    ];

    return items;
  };

  const items = useMemo(() => getItems(data), [data]);

  // 운행일지 대시보드 데이터 가져오기
  const fetchData = async () => {
    if (!isBlurred) {
      try {
        const response = await getDriveDashBoard(
          dateRange.startDate,
          dateRange.endDate
        );
        console.log(data);
        setData(response);
        setError(null);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setError("Error fetching summary data");
        setData(null);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange.endDate]);

  return (
    <div className={`selectedDateRangeData ${isBlurred ? "blurred" : ""}`}>
      <div>
        {items.map((item, index) => (
          <div className="selectedDateRangeData_item" key={index}>
            <div>
              <h4>{item.title}</h4>
              <p>: {item.value}</p>
            </div>
            <p className="top_percent">상위 {item.percent}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriveDateRangeDashBoard;
