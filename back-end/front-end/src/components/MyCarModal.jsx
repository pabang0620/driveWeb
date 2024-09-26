import React, { useState } from "react";
import axios from "axios";
import "./components.scss";

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
    </div>
  );
};

export default MyCarModal;
