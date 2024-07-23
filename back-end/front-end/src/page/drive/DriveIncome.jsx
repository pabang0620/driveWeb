import React, { useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { postDriveIncome } from "../../components/ApiPost";

const DriveIncome = ({ showModal, toggleModal, closeModal }) => {
  const [driveIncomeData, setDriveIncomeData] = useState({
    drivingLogId: parseInt(localStorage.getItem("drivingLogId")) || 0,
    cardIncome: 0,
    cashIncome: 0,
    kakaoIncome: 0,
    uberIncome: 0,
    ondaIncome: 0,
    tadaIncome: 0,
    otherIncome: 0,
    incomeSpare1: 0,
    incomeSpare2: 0,
    incomeSpare3: 0,
    incomeSpare4: 0,
    workingHours: 0,
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
            value={driveIncomeData.cardIncome}
            fieldName="cardIncome"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"현금"}
            inputType={"number"}
            value={driveIncomeData.cashIncome}
            fieldName="cashIncome"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"카카오"}
            inputType={"number"}
            value={driveIncomeData.kakaoIncome}
            fieldName="kakaoIncome"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"우버"}
            inputType={"number"}
            value={driveIncomeData.uberIncome}
            fieldName="uberIncome"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"온다"}
            inputType={"number"}
            value={driveIncomeData.ondaIncome}
            fieldName="ondaIncome"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"타다"}
            inputType={"number"}
            value={driveIncomeData.tadaIncome}
            fieldName="tadaIncome"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"잡수입"}
            inputType={"number"}
            value={driveIncomeData.otherIncome}
            fieldName="otherIncome"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"수입예비1"}
            inputType={"number"}
            value={driveIncomeData.incomeSpare1}
            fieldName="incomeSpare1"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"수입예비2"}
            inputType={"number"}
            value={driveIncomeData.incomeSpare2}
            fieldName="incomeSpare2"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"수입예비3"}
            inputType={"number"}
            value={driveIncomeData.incomeSpare3}
            fieldName="incomeSpare3"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"수입예비4"}
            inputType={"number"}
            value={driveIncomeData.incomeSpare4}
            fieldName="incomeSpare4"
            onChange={handleInputChange}
          />
          <button onClick={handleNext}>다음</button>
        </div>
      }
    />
  );
};

export default DriveIncome;
