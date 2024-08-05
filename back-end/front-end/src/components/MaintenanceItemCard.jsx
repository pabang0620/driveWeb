import React, { useState, useEffect } from "react";
import MaintenanceRecordModal from "./MaintenanceRecordModal";
import { useNavigate } from "react-router-dom";

const MaintenanceItemCard = ({
  item,
  token,
  onRecordAdded,
  maintenanceItems,
}) => {
  const { name = "이름 없음", maintenance_records } = item;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastMaintenanceRecord, setLastMaintenanceRecord] = useState(null);
  const [maintenancePercent, setMaintenancePercent] = useState(0);
  const [isWarning, setIsWarning] = useState(false); // 경고 상태

  useEffect(() => {
    if (maintenance_records.length > 0) {
      const lastRecord = maintenance_records[maintenance_records.length - 1];
      setLastMaintenanceRecord(lastRecord);
      const percent =
        (lastRecord.mileageAtMaintenance / lastRecord.maintenanceDistance) *
        100;
      setMaintenancePercent(percent);

      // 정비 주기 계산
      const maintenanceIntervalMonths = lastRecord.maintenanceInterval;
      const maintenanceDate = new Date(lastRecord.maintenanceDate);
      const nextMaintenanceDate = new Date(
        maintenanceDate.setMonth(
          maintenanceDate.getMonth() + maintenanceIntervalMonths
        )
      );

      const currentDate = new Date();
      const diffTime = Math.abs(nextMaintenanceDate - currentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        setIsWarning(true);
      }
    }
  }, [maintenance_records]);

  const formatDate = (date) => {
    if (!date) return "날짜를 기입해주세요";
    const parsedDate = new Date(date);
    return isNaN(parsedDate)
      ? "유효한 날짜가 아닙니다"
      : parsedDate.toLocaleDateString();
  };

  const progressBarColor = maintenancePercent >= 80 ? "#CA3D29" : "#05ACED";

  return (
    <div className="maintenance-item-card">
      <h3>
        {isWarning && <span className="warning-icon">!</span>}
        {name}
      </h3>
      {lastMaintenanceRecord ? (
        <p className="itemCardResent">
          최근 정비: {formatDate(lastMaintenanceRecord.maintenanceDate)} |{" "}
          {lastMaintenanceRecord.mileageAtMaintenance}km
        </p>
      ) : (
        <div className="no-records">
          <p>정비 기록이 없습니다</p>
          <button
            className="maintenance-addRecord"
            onClick={() => setIsModalOpen(true)}
          >
            정비 옵션 설정하기
          </button>
        </div>
      )}
      {lastMaintenanceRecord && (
        <>
          <div className="maintenance-progress-bar">
            <div
              className="maintenance-progress"
              style={{
                width: `${maintenancePercent}%`,
                backgroundColor: progressBarColor,
              }}
            />
          </div>
          <p className="nowSizeandFree">
            {lastMaintenanceRecord.mileageAtMaintenance}km /{" "}
            {lastMaintenanceRecord.maintenanceDistance}km마다
          </p>
        </>
      )}
      {lastMaintenanceRecord && (
        <button
          className="maintenance-reportCard"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="penOppset">&#9998;</div> <div>정비 기록 하기</div>
        </button>
      )}{" "}
      <MaintenanceRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={token}
        maintenanceItemId={item.id}
        onRecordAdded={onRecordAdded}
        maintenanceItems={maintenanceItems}
        lastMaintenanceRecord={lastMaintenanceRecord}
        maintenancePercent={maintenancePercent}
        progressBarColor={progressBarColor}
        formatDate={formatDate}
      />
      <style jsx>{`
        .maintenance-item-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 3.5%;
          width: 48%;
          box-sizing: border-box;
          position: relative;
          @media (max-width: 768px) {
            width: 47%;
          }
          @media (max-width: 480px) {
            width: 100%;
          }
          h3 {
            font-size: 18px;
            @media (max-width: 768px) {
              font-size: 16px;
            }
          }
          .itemCardResent {
            color: #c1c1c1;
            font-size: 14px;
            @media (max-width: 768px) {
              font-size: 11px;
            }
          }
          .nowSizeandFree {
            font-size: 11px;
          }

          .no-records {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100px;
            background-color: #f9f9f9;
            border: 2px dashed #ccc;
            border-radius: 8px;
            margin: 10px 0;
            position: relative;
            text-align: center;
            font-size: 14px;
            @media (max-width: 768px) {
              font-size: 12px;
            }
          }
          .maintenance-addRecord {
            background-color: #3c5997;
            white-space: nowrap;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px 24px;
            cursor: pointer;
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: background-color 0.3s ease;
          }
          .no-records:hover .maintenance-addRecord {
            display: block;
          }
          .maintenance-addRecord:hover {
            background-color: #2b4b79;
          }
          .maintenance-reportCard {
            width: 100%;
            margin: 0px auto;
            background-color: #3c5997;
            border: none;
            border-radius: 4px;
            padding: 10px 20px;
            cursor: pointer;
            margin-top: 8%;
            transition: background-color 0.3s ease;
            display: flex;
            flex-direction: row;
            justify-content: center;
            .penOppset {
              transform: scaleX(-1);
              margin-right: 10px;
            }
            div {
              color: white;
              @media (max-width: 768px) {
                font-size: 12px;
              }
            }
          }

          .maintenance-reportCard:hover {
            background-color: #2b4b79;
          }
          .maintenance-progress-bar {
            width: 100%;
            background-color: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
            height: 7px; /* 게이지 바의 높이를 7픽셀로 조정 */
          }
          .maintenance-progress {
            height: 100%; /* 부모 요소의 전체 높이를 차지하도록 설정 */
          }
          .warning-icon {
            text-align: center;
            padding: 0px 7px;
            font-size: 15px;
            background-color: red;
            color: white;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenanceItemCard;
