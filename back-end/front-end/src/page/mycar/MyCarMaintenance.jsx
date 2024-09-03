import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import MyCarModal from "../../components/MyCarModal";
import MaintenanceItemCard from "../../components/MaintenanceItemCard";
import useCheckPermission from "../../utils/useCheckPermission";

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
      <style jsx>{`
        .MyCarMaintenance {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0 100px 0;
          }
        }
        .maintenance-items {
          display: flex;
          flex-wrap: wrap;
          margin-top: 30px;
          gap: 20px;
          justify-content: space-between;
        }
        .no-items {
          width: 100%;
          text-align: center;
          color: #666;
        }
        .add-item {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 3.5%;
          width: 48%;
          box-sizing: border-box;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          @media (max-width: 768px) {
            width: 47%;
          }
          @media (max-width: 480px) {
            width: 100%;
          }
        }
        .add-item.centered {
          width: 100%;
          margin-top: 20px;
        }
        .add-icon {
          font-size: 24px;
          color: #0070f3;
        }
      `}</style>
    </div>
  );
};

export default MyCarMaintenance;
