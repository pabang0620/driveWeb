import React, { useState } from "react";
import axios from "axios";

const MyCarModal = ({ isOpen, onClose, token, onItemAdded, myCarId }) => {
  const [newItemName, setNewItemName] = useState("");

  const handleAddItemClick = async () => {
    try {
      const response = await axios.post(
        "/api/maintenance/items",
        { name: newItemName, unit: "km", my_carId: myCarId },
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
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
        }
        .modal-content {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 12px;
          width: 400px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .close {
          color: #333;
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
        }
        .close:hover {
          color: #000;
        }
        h2 {
          margin: 0 0 20px;
          font-size: 24px;
          text-align: center;
          color: #333;
        }
        .modal-content input {
          width: 100%;
          padding: 15px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }
        .modal-content input:focus {
          border-color: #3c5997;
          outline: none;
        }
        .modal-content button {
          width: 100%;
          padding: 15px;
          background-color: #3c5997;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .modal-content button:hover {
          background-color: #2b4b79;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default MyCarModal;
