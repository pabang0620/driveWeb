import React, { useState, useEffect } from "react";
import axios from "axios";
import "./components.scss";

const MaintenanceRecordModal = ({
  isOpen,
  onClose,
  token,
  maintenanceItemId,
  onRecordAdded,
  maintenanceItems,
  lastMaintenanceRecord,
  maintenancePercent,
  progressBarColor,
  formatDate,
}) => {
  const [newRecord, setNewRecord] = useState({
    maintenanceDate: "",
    maintenanceInterval: "",
    maintenanceDistance: "",
    maintenanceMethod: "",
    mileageAtMaintenance: "",
    maintenanceCost: "",
  });

  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");

  useEffect(() => {
    const selectedItem = maintenanceItems.find(
      (item) => item.id === maintenanceItemId
    );

    if (selectedItem) {
      setSelectedItemName(selectedItem.name);

      // lastMaintenanceRecord가 없을 경우 기본값 설정
      if (!lastMaintenanceRecord) {
        setNewRecord({
          maintenanceDate: new Date().toISOString().split("T")[0], // 오늘 날짜
          maintenanceInterval: "",
          maintenanceDistance: "",
          mileageAtMaintenance: 0, // 현재 주행 거리 0으로 설정
          maintenanceCost: 0, // 정비 금액 0으로 설정
        });
        setSelectedMethod(""); // 기본적으로 선택되지 않은 상태
      } else {
        const latestRecord = selectedItem.maintenance_records.sort(
          (a, b) => b.id - a.id
        )[0];

        if (latestRecord) {
          setNewRecord({
            maintenanceDate: latestRecord.maintenanceDate
              ? new Date(latestRecord.maintenanceDate)
                  .toISOString()
                  .split("T")[0]
              : "",
            maintenanceInterval:
              latestRecord.maintenanceInterval != null
                ? latestRecord.maintenanceInterval
                : "",
            maintenanceDistance:
              latestRecord.maintenanceDistance != null
                ? latestRecord.maintenanceDistance
                : "",
            mileageAtMaintenance:
              latestRecord.mileageAtMaintenance != null
                ? latestRecord.mileageAtMaintenance
                : "",
            maintenanceCost:
              latestRecord.maintenanceCost != null
                ? latestRecord.maintenanceCost
                : "",
          });
          setSelectedMethod(""); // 선택된 정비 방식은 초기화
        }
      }
    }
  }, [maintenanceItemId, maintenanceItems, lastMaintenanceRecord]);

  const handleRecordChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setNewRecord((prev) => ({
      ...prev,
      maintenanceMethod: method,
    }));
  };

  const handleAddRecordClick = async () => {
    try {
      const maintenanceDistance =
        typeof newRecord.maintenanceDistance === "string"
          ? parseInt(newRecord.maintenanceDistance.replace("km", ""))
          : newRecord.maintenanceDistance;

      const mileageAtMaintenance =
        typeof newRecord.mileageAtMaintenance === "string"
          ? parseInt(newRecord.mileageAtMaintenance.replace("km", ""))
          : newRecord.mileageAtMaintenance;

      const maintenanceCost =
        typeof newRecord.maintenanceCost === "string"
          ? parseFloat(newRecord.maintenanceCost.replace("원", ""))
          : newRecord.maintenanceCost;

      const response = await axios.post(
        "/api/maintenance/records",
        {
          maintenanceDate: newRecord.maintenanceDate,
          maintenanceInterval: parseInt(newRecord.maintenanceInterval),
          maintenanceDistance,
          maintenanceMethod: newRecord.maintenanceMethod,
          mileageAtMaintenance,
          maintenanceCost,
          maintenanceItemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onRecordAdded(response.data.record);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error adding maintenance record:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="myCarAddedmodal">
      <div className="modal-content">
        <div className="myCarmodal-header">
          <h2>{selectedItemName}</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="RecordModalHeader">
          {lastMaintenanceRecord && (
            <>
              <p className="recrodModalHeaderP">
                최근 정비: {formatDate(lastMaintenanceRecord.maintenanceDate)} |{" "}
                {lastMaintenanceRecord.mileageAtMaintenance}km
              </p>
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
        </div>
        <div className="section">
          <label>정비기간 주기</label>
          <div className="input-container">
            <input
              type="text"
              id="maintenanceInterval"
              name="maintenanceInterval"
              value={newRecord.maintenanceInterval}
              onChange={handleRecordChange}
              style={{ textAlign: "right" }}
            />
            <span className="unit">개월</span>
          </div>
        </div>
        <div className="section">
          <label>정비거리 주기</label>
          <div className="input-container">
            <input
              type="text"
              id="maintenanceDistance"
              name="maintenanceDistance"
              value={newRecord.maintenanceDistance}
              onChange={handleRecordChange}
              style={{ textAlign: "right" }}
            />
            <span className="unit">km</span>
          </div>
        </div>
        <div className="section">
          <label>정비한 날</label>
          <input
            type="date"
            id="maintenanceDate"
            name="maintenanceDate"
            value={newRecord.maintenanceDate}
            onChange={handleRecordChange}
            style={{ textAlign: "right" }}
          />
        </div>
        <div className="section">
          <label>정비 방식</label>
          <div className="button-group">
            <button
              type="button"
              className={selectedMethod === "정비소" ? "selected" : ""}
              onClick={() => handleMethodChange("정비소")}
            >
              정비소
            </button>
            <button
              type="button"
              className={selectedMethod === "자가 정비" ? "selected" : ""}
              onClick={() => handleMethodChange("자가 정비")}
            >
              자가 정비
            </button>
          </div>
        </div>
        <div className="section">
          <label>정비 후 주행거리</label>
          <div className="input-container">
            <input
              type="text"
              id="mileageAtMaintenance"
              name="mileageAtMaintenance"
              value={newRecord.mileageAtMaintenance}
              onChange={handleRecordChange}
              style={{ textAlign: "right" }}
            />
            <span className="unit">km</span>
          </div>
        </div>
        <div className="section">
          <label>정비 금액</label>
          <div className="input-container">
            <input
              type="text"
              id="maintenanceCost"
              name="maintenanceCost"
              value={newRecord.maintenanceCost}
              onChange={handleRecordChange}
              style={{ textAlign: "right" }}
            />
            <span className="unit">원</span>
          </div>
        </div>
        <button className="MaintenaceSaveBTN" onClick={handleAddRecordClick}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default MaintenanceRecordModal;
