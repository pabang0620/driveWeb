import React, { useEffect, useState } from "react";
import { getDriveDetails } from "../../components/ApiGet";

const DriveDetails = ({ showModal, closeModal, drivingLogId }) => {
  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("drive");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getDriveDetails(drivingLogId);
        setDetails(data);
      } catch (error) {
        console.error("Error fetching drive details:", error);
      }
    };

    if (showModal) {
      fetchDetails();
    }
  }, [showModal, drivingLogId]);

  if (!showModal || !details) {
    return null;
  }

  const filterZeroValues = (obj) => {
    const filtered = {};
    for (const key in obj) {
      if (obj[key] !== 0 && obj[key] !== "0" && obj[key] !== null) {
        filtered[key] = obj[key];
      }
    }
    return filtered;
  };

  const renderTabContent = () => {
    if (activeTab === "drive") {
      const {
        start_time,
        end_time,
        driving_distance,
        fuel_amount,
        total_driving_cases,
        fuel_efficiency,
        business_rate,
        day_of_week,
      } = details.driving_records[0];
      return (
        <div>
          <p>메모: {details.memo}</p>
          <p>작성 날짜: {details.date.split("T")[0]}</p>
          <p>시작 시간: {start_time.split("T")[1]}</p>
          <p>종료 시간: {end_time.split("T")[1]}</p>
          <p>주행 거리: {driving_distance} km</p>
          <p>주유량: {fuel_amount} L</p>
          <p>총 운행 수: {total_driving_cases} 회</p>
          <p>연비: {fuel_efficiency} km/L</p>
          <p>영업률: {business_rate} %</p>
          <p>요일: {day_of_week}</p>
        </div>
      );
    }

    if (activeTab === "income") {
      const filteredIncome = filterZeroValues(details.income_records);
      return (
        <div>
          {filteredIncome &&
            Object.keys(filteredIncome).map((key) => (
              <p key={key}>
                {key.replace(/_/g, " ")}: {filteredIncome[key]} 원
              </p>
            ))}
        </div>
      );
    }

    if (activeTab === "expense") {
      const filteredExpense = filterZeroValues(details.expense_records);
      return (
        <div>
          {filteredExpense &&
            Object.keys(filteredExpense).map((key) => (
              <p key={key}>
                {key.replace(/_/g, " ")}: {filteredExpense[key]} 원
              </p>
            ))}
        </div>
      );
    }
  };

  return (
    <div className="driveModal">
      <div className="modal-inner">
        <div className="modal-header">
          <h3>
            <span>상세</span>
            운행일지
          </h3>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
        </div>
        <div className="modal-content">
          <div className="tabs">
            <button
              className={activeTab === "drive" ? "active" : ""}
              onClick={() => setActiveTab("drive")}
            >
              운행
            </button>
            <button
              className={activeTab === "income" ? "active" : ""}
              onClick={() => setActiveTab("income")}
            >
              수입
            </button>
            <button
              className={activeTab === "expense" ? "active" : ""}
              onClick={() => setActiveTab("expense")}
            >
              지출
            </button>
          </div>
          <div className="tab-content">{renderTabContent()}</div>
        </div>
      </div>
      <style jsx>{`
        .driveModal {
          display: ${showModal ? "block" : "none"};
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
          .modal-inner {
            top: -20%;
            background-color: #fefefe;
            margin: 15% auto;
            border: 1px solid #888;
            width: 80%;
            max-width: 600px;
            position: relative;
            border-radius: 10px;
            overflow: hidden;
          }
          .modal-header {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f3f4fb;
            padding: 10px 20px;
            h3 {
              width: 100%;
              text-align: center;
              color: #4c4c4c;
              font-size: 16px;
              span {
                display: inline-block;
                background-color: #05aced;
                width: 25px;
                height: 25px;
                margin-right: 3px;
                border-radius: 100%;
                color: white;
              }
            }
            .close {
              margin-left: auto;
              color: #aaa;
              font-size: 28px;
              font-weight: bold;
              cursor: pointer;
            }

            .close:hover,
            .close:focus {
              color: black;
              text-decoration: none;
              cursor: pointer;
            }
          }
          .modal-content {
            width: 100%;
            padding: 20px;
          }
          .tabs {
            display: flex;
            margin-bottom: 20px;
          }
          .tabs button {
            flex: 1;
            padding: 10px;
            cursor: pointer;
            border: none;
            background-color: #f1f1f1;
            font-size: 16px;
          }
          .tabs button.active {
            background-color: #05aced;
            color: white;
          }
          .tab-content {
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default DriveDetails;
