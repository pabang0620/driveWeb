import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import MyCarModal from "../../components/MyCarModal";
import MaintenanceItemCard from "../../components/MaintenanceItemCard";
import useCheckPermission from "../../utils/useCheckPermission";
import "./mycar.scss";

const MyCarMaintenance = () => {
  useCheckPermission();

  const token = localStorage.getItem("token");
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchMaintenanceItems = async () => {
      try {
        const response = await axios.get("/api/maintenance/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.map((item) => ({
          ...item,
          lastMaintenanceDate: item.lastMaintenanceDate
            ? new Date(item.lastMaintenanceDate)
            : new Date(),
          nextMaintenanceDate: item.nextMaintenanceDate
            ? new Date(item.nextMaintenanceDate)
            : new Date(),
        }));
        setMaintenanceItems(data);
      } catch (error) {
        console.error("Error fetching maintenance items:", error);
      }
    };

    fetchMaintenanceItems();
  }, [token]);

  useEffect(() => {
    const sorted = [...maintenanceItems].sort((a, b) => {
      const aRecords = a.maintenance_records || []; // undefined 대비
      const bRecords = b.maintenance_records || []; // undefined 대비

      if (aRecords.length > 0 && bRecords.length === 0) {
        return -1;
      }
      if (aRecords.length === 0 && bRecords.length > 0) {
        return 1;
      }

      // 남은 일수에 따른 우선순위
      const aWarning = aRecords.some((record) => {
        const maintenanceIntervalMonths = record.maintenanceInterval;
        const maintenanceDate = new Date(record.maintenanceDate);
        const nextMaintenanceDate = new Date(
          maintenanceDate.setMonth(
            maintenanceDate.getMonth() + maintenanceIntervalMonths
          )
        );
        const currentDate = new Date();
        const diffTime = Math.abs(nextMaintenanceDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });

      const bWarning = bRecords.some((record) => {
        const maintenanceIntervalMonths = record.maintenanceInterval;
        const maintenanceDate = new Date(record.maintenanceDate);
        const nextMaintenanceDate = new Date(
          maintenanceDate.setMonth(
            maintenanceDate.getMonth() + maintenanceIntervalMonths
          )
        );
        const currentDate = new Date();
        const diffTime = Math.abs(nextMaintenanceDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });

      if (aWarning && !bWarning) return -1;
      if (!aWarning && bWarning) return 1;

      // 주행 거리 비율에 따른 우선순위
      const aPercent =
        aRecords.length > 0
          ? (aRecords[aRecords.length - 1].mileageAtMaintenance /
              aRecords[aRecords.length - 1].maintenanceDistance) *
            100
          : 0;
      const bPercent =
        bRecords.length > 0
          ? (bRecords[bRecords.length - 1].mileageAtMaintenance /
              bRecords[bRecords.length - 1].maintenanceDistance) *
            100
          : 0;

      if (aPercent >= 80 && bPercent < 80) return -1;
      if (aPercent < 80 && bPercent >= 80) return 1;

      return 0;
    });

    setSortedItems(sorted);
  }, [maintenanceItems]);

  const handleItemAdded = (newItem) => {
    setMaintenanceItems([...maintenanceItems, newItem]);
  };

  const handleRecordAdded = (newRecord) => {
    // 필요한 경우 기록이 추가된 후 상태를 업데이트하는 로직을 여기에 작성합니다.
  };

  const myCarId =
    Array.isArray(maintenanceItems) && maintenanceItems.length > 0
      ? maintenanceItems[0].my_carId
      : null;

  return (
    <div className="MyCarMaintenance">
      <TitleBox title="차계부" subtitle="정비항목" />
      <div className="maintenance-items">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <MaintenanceItemCard
              key={item.id}
              item={item}
              token={token}
              onRecordAdded={handleRecordAdded}
              maintenanceItems={maintenanceItems}
            />
          ))
        ) : (
          <div className="no-items">
            <p>정비 항목이 없습니다.</p>
          </div>
        )}
        <div
          className={`maintenance-item add-item ${
            sortedItems.length === 0 ? "centered" : ""
          }`}
          onClick={() => setModalIsOpen(true)}
        >
          <div className="add-icon">+</div>
        </div>
      </div>
      <MyCarModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        token={token}
        onItemAdded={handleItemAdded}
        myCarId={myCarId} // 추가된 부분
      />
    </div>
  );
};

export default MyCarMaintenance;
