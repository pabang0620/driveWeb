import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import MyCarModal from "../../components/MyCarModal";
import MaintenanceItemCard from "../../components/MaintenanceItemCard";

const MyCarMaintenance = () => {
  const token = localStorage.getItem("token");
  const [maintenanceItems, setMaintenanceItems] = useState([
    {
      id: 1,
      name: "에어클리너 필터",
      my_carId: 1,
      userId: 1,
      unit: "km",
      maintenance_records: [],
    },
    {
      id: 2,
      name: "공조 장치용 에어필터",
      my_carId: 1,
      userId: 1,
      unit: "km",
      maintenance_records: [],
    },
    {
      id: 3,
      name: "타이어 위치 교체",
      my_carId: 1,
      userId: 1,
      unit: "km",
      maintenance_records: [],
    },
    {
      id: 4,
      name: "브레이크/클러치(사양 적용시)액",
      my_carId: 1,
      userId: 1,
      unit: "km",
      maintenance_records: [],
    },
    {
      id: 5,
      name: "엔진 오일 및 오일필터",
      my_carId: 1,
      userId: 1,
      unit: "km",
      maintenance_records: [],
    },
    {
      id: 6,
      name: "점화 플러그",
      my_carId: 1,
      userId: 1,
      unit: "km",
      maintenance_records: [],
    },
    {
      id: 7,
      name: "냉각수량 점검 및 교체",
      my_carId: 1,
      userId: 1,
      unit: "km",
      maintenance_records: [],
    },
  ]);
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
      // maintenance_records 데이터의 유무에 따른 우선순위 처리
      if (
        a.maintenance_records.length > 0 &&
        b.maintenance_records.length === 0
      ) {
        return -1; // a에 데이터가 있고, b에 데이터가 없으면 a를 앞으로
      }
      if (
        a.maintenance_records.length === 0 &&
        b.maintenance_records.length > 0
      ) {
        return 1; // a에 데이터가 없고, b에 데이터가 있으면 b를 앞으로
      }

      // 남은 일수에 따른 우선순위
      const aWarning = a.maintenance_records.some((record) => {
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

      const bWarning = b.maintenance_records.some((record) => {
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
        a.maintenance_records.length > 0
          ? (a.maintenance_records[a.maintenance_records.length - 1]
              .mileageAtMaintenance /
              a.maintenance_records[a.maintenance_records.length - 1]
                .maintenanceDistance) *
            100
          : 0;
      const bPercent =
        b.maintenance_records.length > 0
          ? (b.maintenance_records[b.maintenance_records.length - 1]
              .mileageAtMaintenance /
              b.maintenance_records[b.maintenance_records.length - 1]
                .maintenanceDistance) *
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
          padding: 16px;
          width: 350px; /* 카드 너비 */
          height: 188px; /* 카드 높이 */
          box-sizing: border-box;
          margin: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
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
