import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getDriveDashBoard } from "../../components/ApiGet";

const DriveDateRangeDashBoard = ({ dateRange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // 데이터가 업데이트되면 items를 설정
  const getItems = (data) => {
    if (!data) return [];

    const items = [
      {
        title: "총 작업 시간(초)",
        value: data.totalWorkingHours,
        percent: data.workingHoursPercentage,
      },
      {
        title: "총 주행 거리(킬로미터)",
        value: data.totalDrivingDistance,
        percent: data.drivingDistancePercentage,
      },
      {
        title: "총 영업 거리(킬로미터)",
        value: data.totalBusinessDistance,
        percent: data.businessDistancePercentage,
      },
      {
        title: "총 영업 비율(%)",
        value: data.totalBusinessRate,
        percent: data.businessRatePercentage,
      },
      {
        title: "총 연료 소모량(리터)",
        value: data.totalFuelAmount,
        percent: data.fuelAmountPercentage,
      },
      {
        title: "총 연비(킬로미터/리터)",
        value: data.totalFuelEfficiency,
        percent: data.fuelEfficiencyPercentage,
      },
      {
        title: "총 운전 횟수",
        value: data.totalDrivingCases,
        percent: data.drivingCasesPercentage,
      },
      {
        title: "시간당 총 수입(원)",
        value: data.totalIncomePerHour,
        percent: data.incomePerHourPercentage,
      },
      {
        title: "킬로미터당 총 수입(원)",
        value: data.totalIncomePerKm,
        percent: data.incomePerKmPercentage,
      },
    ];
    return items;
  };
  const items = useMemo(() => getItems(data), [data]);

  // 운행일지 대시보드 데이터 가져오기
  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return (
    <div className="selectedDateRangeData">
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
      <style jsx>{`
        .selectedDateRangeData {
          width: 48.5%;
          aspect-ratio: 1 / 0.9;
          background-color: white;
          padding: 2%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          > div {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: space-between;
            gap: 1%;
          }
          .selectedDateRangeData_item {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: #222;
            > div {
              width: 60%;
              display: flex;
              h4 {
                color: #05aced;
                margin-right: 5px;
              }
              p {
              }
            }
            .top_percent {
              background-color: #05aced;
              color: white;
              font-size: 13px;
              width: 20%;
              border-radius: 5px;
              width: auto;
              padding: 1% 2%;
              text-align: center;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default DriveDateRangeDashBoard;
