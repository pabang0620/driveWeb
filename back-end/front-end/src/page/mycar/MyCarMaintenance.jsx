import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import MyCarModal from "../../components/MyCarModal";
import MaintenanceItemCard from "../../components/MaintenanceItemCard";

const MyCarMaintenance = () => {
  const token = localStorage.getItem("token");
  const [maintenanceItems, setMaintenanceItems] = useState([]);
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

  const handleItemAdded = (newItem) => {
    setMaintenanceItems([...maintenanceItems, newItem]);
  };

  const handleRecordAdded = (newRecord) => {
    // 필요한 경우 기록이 추가된 후 상태를 업데이트하는 로직을 여기에 작성합니다.
  };

  return (
    <div className="MyCarMaintenance">
      <TitleBox title="차계부" subtitle=" 차량정보" />
      <div className="maintenance-items">
        {maintenanceItems.length > 0 ? (
          maintenanceItems.map((item) => (
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
            maintenanceItems.length === 0 ? "centered" : ""
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
      />
      <style jsx>{`
        .MyCarMaintenance {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
        }
        .maintenance-items {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .no-items {
          width: 100%;
          text-align: center;
          color: #666;
        }
        .add-item {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #ccc;
          border-radius: 8px;
          padding: 16px;
          width: calc(33.333% - 20px);
          box-sizing: border-box;
          cursor: pointer;
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
