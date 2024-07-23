import React, { useState, useEffect } from "react";
import axios from "axios";

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

      await axios.put(
        `/api/maintenance/records/${recordData[0].id}`,
        {
          maintenanceDate: newRecord.maintenanceDate,
          maintenanceDistance,
          maintenanceMethod: newRecord.maintenanceMethod,
          mileageAtMaintenance,
          maintenanceCost,
          maintenanceItemId: recordData[0].maintenanceItemId,
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
          <label>현재 주행 거리</label>
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
      <style jsx>{`
        .myCarAddedmodal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
          .myCarmodal-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }
        }
        .modal-content {
          background-color: #fff;
          padding: 20px;
          border: 1px solid #888;
          width: 400px;
          border-radius: 8px;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
        h2 {
          font-size: 16px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .section label {
          font-weight: bold;
          flex: 1;
          font-size: 14px;
        }
        .section input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          text-align: right;
          height: 30px;
        }
        .input-container {
          width: 170px;
          display: flex;
          align-items: center;
          justify-content: right;
        }
        .input-container .unit {
          margin-left: 5px;
          font-size: 16px;
          font-weight: bold;
        }
        .button-group {
          display: flex;
          justify-content: space-between;
        }
        .button-group button {
          flex: 1;
          width: 75px;
          height: 30px;
          line-height: 30px;
          margin: 0 5px;
          border-radius: 4px;
          cursor: pointer;
          background-color: white;
          border: 1px solid #ccc;
        }
        .button-group button.selected {
          border: 1px solid #3c5997;
          color: #3c5997;
        }
        .MaintenaceSaveBTN {
          width: 100%;
          background-color: #3c5997;
          color: white;
          margin: 15px auto 10px;
          padding: 8.5px 0px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default MaintenanceEditModal;
