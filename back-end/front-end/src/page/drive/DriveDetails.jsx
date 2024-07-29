import React, { useEffect, useState } from "react";
import { getDriveDetails } from "../../components/ApiGet";
import translateKey from "../../utils/translateKey";

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
      if (
        obj[key] !== 0 &&
        obj[key] !== "0" &&
        obj[key] !== null &&
        ![
          "id",
          "driving_log_id",
          "created_at",
          "updated_at",
          "userId",
        ].includes(key)
      ) {
        filtered[key] = obj[key];
      }
    }
    return filtered;
  };

  const daysOfWeek = {
    Sunday: "일요일",
    Monday: "월요일",
    Tuesday: "화요일",
    Wednesday: "수요일",
    Thursday: "목요일",
    Friday: "금요일",
    Saturday: "토요일",
  };

  const renderTabContent = () => {
    if (activeTab === "drive") {
      if (!details.driving_records || details.driving_records.length === 0) {
        return <div className="tab-content">운행 기록이 없습니다.</div>;
      }
      const {
        start_time,
        end_time,
        working_hours,
        driving_distance,
        fuel_amount,
        total_driving_cases,
        fuel_efficiency,
        business_rate,
        day_of_week,
        business_distance,
      } = details.driving_records[0];
      return (
        <div className="tab-content">
          <div className="data-row">
            <strong>작성 날짜:</strong>
            <span>{daysOfWeek[day_of_week]}</span>
            <span>{details.date.split("T")[0]}</span>
          </div>
          <div className="data-row">
            <strong>시작 시간:</strong>{" "}
            <span>{start_time.split("T")[1].substring(0, 8)}</span>
          </div>
          <div className="data-row">
            <strong>종료 시간:</strong>{" "}
            <span>{end_time.split("T")[1].substring(0, 8)}</span>
          </div>
          <div className="data-row">
            <strong>근무 시간:</strong>{" "}
            <span>{new Date(working_hours).getUTCHours()} 시간</span>
          </div>
          <div className="data-row">
            <strong>주행 거리:</strong> <span>{driving_distance} km</span>
          </div>
          <div className="data-row">
            <strong>영업 거리:</strong> <span>{business_distance} km</span>
          </div>
          <div className="data-row">
            <strong>주유량:</strong> <span>{fuel_amount} L</span>
          </div>
          <div className="data-row">
            <strong>총 운행 수:</strong> <span>{total_driving_cases} 회</span>
          </div>
          <div className="data-row">
            <strong>연비:</strong> <span>{fuel_efficiency} km/L</span>
          </div>
          <div className="data-row">
            <strong>영업률:</strong> <span>{business_rate} %</span>
          </div>
          <div className="data-row">
            <strong>메모:</strong> <span>{details.memo}</span>
          </div>
        </div>
      );
    }

    if (activeTab === "income") {
      const filteredIncome = filterZeroValues(details.income_records);
      if (Object.keys(filteredIncome).length === 0) {
        return <div className="tab-content">수입이 없습니다.</div>;
      }
      return (
        <div className="tab-content">
          {filteredIncome &&
            Object.keys(filteredIncome).map((key) => (
              <div className="data-row" key={key}>
                <strong>{translateKey(key)}:</strong>{" "}
                <span>{filteredIncome[key]} 원</span>
              </div>
            ))}
        </div>
      );
    }

    if (activeTab === "expense") {
      const filteredExpense = filterZeroValues(details.expense_records);
      if (Object.keys(filteredExpense).length === 0) {
        return <div className="tab-content">지출이 없습니다.</div>;
      }
      return (
        <div className="tab-content">
          {filteredExpense &&
            Object.keys(filteredExpense).map((key) => (
              <div className="data-row" key={key}>
                <strong>{translateKey(key)}:</strong>{" "}
                <span>{filteredExpense[key]} 원</span>
              </div>
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
            <span>상세 운행일지</span>
          </h3>
          <span className="close" onClick={() => closeModal(false)}>
            &times;
          </span>
        </div>
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
        <div className="modal-content">{renderTabContent()}</div>
      </div>
      <style jsx>{`
        .driveModal {
          display: ${showModal ? "flex" : "none"};
          align-items: center;
          justify-content: center;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          .modal-inner {
            background-color: #fefefe;
            margin: auto;
            border: 1px solid #888;
            width: 70%;
            max-width: 400px;
            height: 500px;
            position: relative;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
          }
          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #f3f4fb;
            padding: 10px 20px;
            flex-shrink: 0;
            h3 {
              text-align: center;
              color: #4c4c4c;
              font-size: 16px;
              span {
                display: inline-block;
                background-color: #05aced;
                width: auto;
                padding: 0 10px;
                height: 25px;
                border-radius: 10px;
                color: white;
                text-align: center;
                line-height: 25px;
              }
            }
            .close {
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
          .tabs {
            display: flex;
            justify-content: space-around;
            margin: 10px 20px;
            button {
              flex: 1;
              padding: 10px;
              cursor: pointer;
              border: none;
              background-color: #f1f1f1;
              font-size: 16px;
              margin-left: 5px;
            }
            button.active {
              background-color: #05aced;
              color: white;
            }
          }
          .modal-content {
            width: 100%;
            padding: 20px;
            flex: 1;
            overflow-y: auto;
          }
          .tab-content {
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .data-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #ddd;
          }
          .data-row strong {
            color: #4c4c4c;
          }
        }
      `}</style>
    </div>
  );
};

export default DriveDetails;
