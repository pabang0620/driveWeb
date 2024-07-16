import React, { useState } from "react";
import MaintenanceRecordModal from "./MaintenanceRecordModal";

const MaintenanceItemCard = ({
  item,
  token,
  onRecordAdded,
  maintenanceItems,
}) => {
  const {
    name = "이름 없음",
    lastMaintenanceDate,
    currentMileage = "200km", // 현재 주행 거리를 상태나 프롭스로 관리해야 할 경우 이 부분을 수정
  } = item;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return "날짜를 기입해주세요";
    const parsedDate = new Date(date);
    return isNaN(parsedDate)
      ? "유효한 날짜가 아닙니다"
      : parsedDate.toLocaleString();
  };

  return (
    <div className="maintenance-item-card">
      <h3>{name}</h3>
      <p>
        최근 정비: {formatDate(lastMaintenanceDate)} | 현재 주행거리:{" "}
        {currentMileage}
      </p>
      <button
        className="maintenance-reportCard"
        onClick={() => setIsModalOpen(true)}
      >
        정비 기록하기
      </button>
      <MaintenanceRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={token}
        maintenanceItemId={item.id}
        onRecordAdded={onRecordAdded}
        maintenanceItems={maintenanceItems}
      />
      <style jsx>{`
        .maintenance-item-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          width: calc(33.333% - 20px);
          box-sizing: border-box;
        }
        .maintenance-reportCard {
          background-color: #3c5997;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          cursor: pointer;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default MaintenanceItemCard;
