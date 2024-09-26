import React, { useState, useEffect } from "react";
import MaintenanceRecordModal from "./MaintenanceRecordModal";
import { useNavigate } from "react-router-dom";
import "./components.scss";

const MaintenanceItemCard = ({
  item,
  token,
  onRecordAdded,
  maintenanceItems,
}) => {
  const { name = "이름 없음", maintenance_records = [] } = item; // default value 설정

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
    </div>
  );
};

export default MaintenanceItemCard;
