import React, { useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { postDriveExpense } from "../../components/ApiPost";

const DriveExpense = ({ showModal, toggleModal, closeModal }) => {
  const [driveExpenseData, setDriveExpenseData] = useState({
    drivingLogId: parseInt(localStorage.getItem("drivingLogId"), 10) || 0,
    fuelCost: 0,
    tollCost: 0,
    mealCost: 0,
    fineCost: 0,
    otherExpense: 0,
    expenseSpare1: 0,
    expenseSpare2: 0,
    expenseSpare3: 0,
    expenseSpare4: 0,
  });

  const handleSave = async () => {
    try {
      await postDriveExpense(driveExpenseData);
      console.log("운행일지-지출 보내기 성공!");
      toggleModal(); // 모달 닫기
    } catch (error) {
      console.error("운행일지-지출 보내기 실패:", error.message);
    }
    toggleModal(); // 모달 닫기
  };

  const handleInputChange = (field, value) => {
    setDriveExpenseData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <Modal
      closeModal={closeModal}
      showModal={showModal}
      toggleModal={toggleModal}
      number={3}
      title={"지출"}
      content={
        <div className="drive">
          <DynamicInput
            labelName={"주유비"}
            inputType={"number"}
            value={driveExpenseData.fuelCost}
            fieldName="fuelCost"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"통행료"}
            inputType={"number"}
            value={driveExpenseData.tollCost}
            fieldName="tollCost"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"식대"}
            inputType={"number"}
            value={driveExpenseData.mealCost}
            fieldName="mealCost"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"과태료"}
            inputType={"number"}
            value={driveExpenseData.fineCost}
            fieldName="fineCost"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"기타지출"}
            inputType={"number"}
            value={driveExpenseData.otherExpense}
            fieldName="otherExpense"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"지출예비1"}
            inputType={"number"}
            value={driveExpenseData.expenseSpare1}
            fieldName="expenseSpare1"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"지출예비2"}
            inputType={"number"}
            value={driveExpenseData.expenseSpare2}
            fieldName="expenseSpare2"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"지출예비3"}
            inputType={"number"}
            value={driveExpenseData.expenseSpare3}
            fieldName="expenseSpare3"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"지출예비4"}
            inputType={"number"}
            value={driveExpenseData.expenseSpare4}
            fieldName="expenseSpare4"
            onChange={handleInputChange}
          />
          <button onClick={handleSave}>저장</button>
        </div>
      }
    />
  );
};

export default DriveExpense;
