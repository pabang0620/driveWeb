import React, { useState, useEffect } from "react";
import axios from "axios";

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
      const latestRecord = selectedItem.maintenance_records.sort(
        (a, b) => b.id - a.id
      )[0];

      if (latestRecord) {
        setNewRecord({
          maintenanceDate: latestRecord.maintenanceDate
            ? new Date(latestRecord.maintenanceDate).toISOString().split("T")[0]
            : "",
          maintenanceInterval:
            latestRecord.maintenanceInterval != null
              ? latestRecord.maintenanceInterval
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
  }, [maintenanceItemId, maintenanceItems]);

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
          {/* {lastMaintenanceRecord && ( */}
          <p className="recrodModalHeaderP">
            최근 정비:{" "}
            {lastMaintenanceRecord &&
              formatDate(lastMaintenanceRecord.maintenanceDate)}{" "}
            |{" "}
            {lastMaintenanceRecord &&
              lastMaintenanceRecord.mileageAtMaintenance}
            km
          </p>
          {/* )} */}
          {/* {lastMaintenanceRecord && ( */}
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
              {lastMaintenanceRecord &&
                lastMaintenanceRecord.mileageAtMaintenance}
              km /{" "}
              {lastMaintenanceRecord &&
                lastMaintenanceRecord.maintenanceDistance}
              km마다
            </p>
          </>
          {/* )} */}
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
        .nowSizeandFree {
          font-size: 11px;
        }
        .recrodModalHeaderP {
          color: #c1c1c1;
          font-size: 14px;
        }
        .myCarmodal-header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        .RecordModalHeader {
          padding-bottom: 20px;
          border-bottom: 1px solid #d9d9d9;
          margin-bottom: 15px;
        }

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
          .modal-content {
            background-color: #fff;
            padding: 20px;
            border: 1px solid #888;
            width: 400px;
            border-radius: 8px;
            position: relative;
            display: flex;
            flex-direction: column;
            @media (max-width: 768px) {
              width: 80%;
            }
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
            @media (max-width: 768px) {
              margin-bottom: 10px;
            }
          }
          .section label {
            font-weight: bold;
            flex: 1;
            font-size: 14px;
            @media (max-width: 768px) {
              font-size: 12px;
            }
          }
          .section input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            text-align: right;
            height: 30px;
            @media (max-width: 768px) {
              font-size: 12px;
              padding: 3px 8px;
            }
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
            @media (max-width: 768px) {
              font-size: 12px;
            }
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
          #maintenanceInterval {
            width: 131px;
          }
          #maintenanceDistance {
            width: 134px;
          }
          #maintenanceDate {
            width: 165px;
            padding-right: 30px;
          }
          #maintenanceDate::-webkit-calendar-picker-indicator {
            position: absolute;
            right: 25px;
             {
              /* top: 51%;
            transform: translateY(-50%); */
            }
            cursor: pointer;
          }
          #mileageAtMaintenance {
            width: 134px;
          }
          #maintenanceCost {
            width: 144px;
          }
          .MaintenaceSaveBTN {
            width: 100%;
            background-color: #3c5997;
            color: white;
            margin: 15px auto 10px;
            padding: 8.5px 0px;
            border-radius: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenanceRecordModal;