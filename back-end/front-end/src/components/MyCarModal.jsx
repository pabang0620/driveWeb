import React, { useState } from "react";
import axios from "axios";

const MyCarModal = ({ isOpen, onClose, token, onItemAdded, myCarId }) => {
  const [newItemName, setNewItemName] = useState("");

  const handleAddItemClick = async () => {
    try {
      const response = await axios.post(
        "/api/maintenance/items",
        { name: newItemName, unit: "km", my_carId: myCarId }, // my_carId 포함
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onItemAdded(response.data.item);
      setNewItemName("");
      onClose();
    } catch (error) {
      console.error("Error adding maintenance item:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>정비 항목 추가</h2>
        <input
          type="text"
          placeholder="정비 항목 이름"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <button onClick={handleAddItemClick}>추가</button>
      </div>
      <style jsx>{`
        .modal {
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
        }
        .modal-content {
          background-color: #fff;
          padding: 20px;
          border: 1px solid #888;
          width: 400px;
          border-radius: 8px;
          position: relative;
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
        .modal-content input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .modal-content button {
          width: 100%;
          padding: 10px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .modal-content button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default MyCarModal;
