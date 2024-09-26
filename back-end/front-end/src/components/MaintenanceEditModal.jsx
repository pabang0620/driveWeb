import React, { useState, useEffect } from "react";
import axios from "axios";
import "./components.scss";

const MaintenanceEditModal = ({ isOpen, onClose, recordData }) => {
  const [newRecord, setNewRecord] = useState({
    maintenanceDate: "",
    maintenanceDistance: "",
    maintenanceMethod: "",
    mileageAtMaintenance: "",
    maintenanceCost: "",
  });

  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");

  useEffect(() => {
    if (recordData && recordData.length > 0) {
      const latestRecord = recordData.sort((a, b) => b.id - a.id)[0];
      const selectedItem = latestRecord.maintenance_items;

      if (selectedItem) {
        setSelectedItemName(selectedItem.name);
        setNewRecord({
          maintenanceDate: latestRecord.maintenanceDate
            ? new Date(latestRecord.maintenanceDate).toISOString().split("T")[0]
            : "",
          maintenanceDistance:
            latestRecord.maintenanceDistance != null
              ? latestRecord.maintenanceDistance
              : "",
          maintenanceMethod:
            latestRecord.maintenanceMethod != null
              ? latestRecord.maintenanceMethod
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
        setSelectedMethod(
          latestRecord.maintenanceMethod != null
            ? latestRecord.maintenanceMethod
            : ""
        );
      }
    }
  }, [recordData]);

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
      const token = localStorage.getItem("token");
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

      const updatedData = {};
      const latestRecord = recordData[0];

      if (newRecord.maintenanceDate !== latestRecord.maintenanceDate) {
        updatedData.maintenanceDate = newRecord.maintenanceDate;
      }
      if (maintenanceDistance !== latestRecord.maintenanceDistance) {
        updatedData.maintenanceDistance = maintenanceDistance;
      }
      if (newRecord.maintenanceMethod !== latestRecord.maintenanceMethod) {
        updatedData.maintenanceMethod = newRecord.maintenanceMethod;
      }
      if (mileageAtMaintenance !== latestRecord.mileageAtMaintenance) {
        updatedData.mileageAtMaintenance = mileageAtMaintenance;
      }
      if (maintenanceCost !== latestRecord.maintenanceCost) {
        updatedData.maintenanceCost = maintenanceCost;
      }
      if (Object.keys(updatedData).length === 0) {
        onClose();
        return;
      }

      await axios.put(
        `/api/maintenance/records/${latestRecord.id}`,
        {
          ...updatedData,
          maintenanceItemId: latestRecord.maintenanceItemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating maintenance record:", error);
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

export default MaintenanceEditModal;
