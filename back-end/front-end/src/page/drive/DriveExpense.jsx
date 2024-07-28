import React, { useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { postDriveExpense } from "../../components/ApiPost";

const DriveExpense = ({ showModal, toggleModal, closeModal }) => {
  const [driveExpenseData, setDriveExpenseData] = useState({
    driving_log_id: parseInt(localStorage.getItem("drivingLogId"), 10) || 0,
    fuel_expense: 0,
    toll_fee: 0,
    meal_expense: 0,
    fine_expense: 0,
    other_expense: 0,
    expense_spare_1: 0,
    expense_spare_2: 0,
    expense_spare_3: 0,
    expense_spare_4: 0,
  });

  const handleSave = async () => {
    try {
      await postDriveExpense(driveExpenseData);
      console.log("운행일지-지출 보내기 성공!");
      toggleModal(); // 모달 닫기
    } catch (error) {
      console.error("운행일지-지출 보내기 실패:", error.message);
    }
    window.location.reload();
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
            value={driveExpenseData.fuel_expense}
            fieldName="fuel_expense"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"통행료"}
            inputType={"number"}
            value={driveExpenseData.toll_fee}
            fieldName="toll_fee"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"식대"}
            inputType={"number"}
            value={driveExpenseData.meal_expense}
            fieldName="meal_expense"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"과태료"}
            inputType={"number"}
            value={driveExpenseData.fine_expense}
            fieldName="fine_expense"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"기타지출"}
            inputType={"number"}
            value={driveExpenseData.other_expense}
            fieldName="other_expense"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"지출예비1"}
            inputType={"number"}
            value={driveExpenseData.expense_spare_1}
            fieldName="expense_spare_1"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"지출예비2"}
            inputType={"number"}
            value={driveExpenseData.expense_spare_2}
            fieldName="expense_spare_2"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"지출예비3"}
            inputType={"number"}
            value={driveExpenseData.expense_spare_3}
            fieldName="expense_spare_3"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"지출예비4"}
            inputType={"number"}
            value={driveExpenseData.expense_spare_4}
            fieldName="expense_spare_4"
            onChange={handleInputChange}
          />
          <button onClick={handleSave}>저장</button>
        </div>
      }
    />
  );
};

export default DriveExpense;
