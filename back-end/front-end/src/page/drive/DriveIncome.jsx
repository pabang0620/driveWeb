import React, { useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { postDriveIncome } from "../../components/ApiPost";

const DriveIncome = ({ showModal, toggleModal, closeModal }) => {
  const [driveIncomeData, setDriveIncomeData] = useState({
    driving_log_id: parseInt(localStorage.getItem("drivingLogId")) || 0,
    card_income: 0,
    cash_income: 0,
    kakao_income: 0,
    uber_income: 0,
    onda_income: 0,
    tada_income: 0,
    other_income: 0,
    income_spare_1: 0,
    income_spare_2: 0,
    income_spare_3: 0,
    income_spare_4: 0,
    working_hours: 0,
  });

  const handleNext = async () => {
    try {
      await postDriveIncome(driveIncomeData);
      console.log("운행일지-수입 보내기 성공!");
    } catch (error) {
      console.error("운행일지-수입 보내기 실패:", error.message);
    }
    toggleModal(); // 모달 닫기
  };

  const handleInputChange = (field, value) => {
    setDriveIncomeData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <Modal
      closeModal={closeModal}
      showModal={showModal}
      toggleModal={toggleModal}
      number={2}
      title={"수입"}
      content={
        <div className="drive">
          <DynamicInput
            labelName={"카드"}
            inputType={"number"}
            value={driveIncomeData.card_income}
            fieldName="card_income"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"현금"}
            inputType={"number"}
            value={driveIncomeData.cash_income}
            fieldName="cash_income"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"카카오"}
            inputType={"number"}
            value={driveIncomeData.kakao_income}
            fieldName="kakao_income"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"우버"}
            inputType={"number"}
            value={driveIncomeData.uber_income}
            fieldName="uber_income"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"온다"}
            inputType={"number"}
            value={driveIncomeData.onda_income}
            fieldName="onda_income"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"타다"}
            inputType={"number"}
            value={driveIncomeData.tada_income}
            fieldName="tada_income"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"잡수입"}
            inputType={"number"}
            value={driveIncomeData.other_income}
            fieldName="other_income"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"수입예비1"}
            inputType={"number"}
            value={driveIncomeData.income_spare_1}
            fieldName="income_spare_1"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"수입예비2"}
            inputType={"number"}
            value={driveIncomeData.income_spare_2}
            fieldName="income_spare_2"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"수입예비3"}
            inputType={"number"}
            value={driveIncomeData.income_spare_3}
            fieldName="income_spare_3"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"수입예비4"}
            inputType={"number"}
            value={driveIncomeData.income_spare_4}
            fieldName="income_spare_4"
            onChange={handleInputChange}
          />
          <button onClick={handleNext}>다음</button>
        </div>
      }
    />
  );
};

export default DriveIncome;
