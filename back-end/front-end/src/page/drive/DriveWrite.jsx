import React, { useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { postDrive } from "../../components/ApiPost";

const DriveWrite = ({ showModal, toggleModal }) => {
  const [driveData, setDriveData] = useState({
    userId: 1, // userId 추가
    date: new Date().toISOString().split("T")[0], // 현재 날짜 추가
    memo: "",
    startTime: "",
    endTime: "",
    cumulativeKm: 0,
    businessDistance: 0,
    fuelAmount: 0,
    totalDrivingCases: 0,
  });

  const handleNext = async () => {
    console.log(driveData);
    try {
      const response = await postDrive(driveData);
      localStorage.setItems("drivingLogId", response.data.drivingLogId);
      toggleModal();
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleInputChange = (field, value) => {
    setDriveData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <Modal
      showModal={showModal}
      toggleModal={toggleModal}
      number={1}
      title={"운행일지"}
      content={
        <div className="drive">
          <DynamicInput
            labelName={"시작시간"}
            inputType={"date"}
            value={driveData.startTime}
            fieldName="startTime"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"종료시간"}
            inputType={"date"}
            value={driveData.endTime}
            fieldName="endTime"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"누적거리(km)"}
            inputType={"number"}
            value={driveData.cumulativeKm}
            fieldName="cumulativeKm"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"영업거리(km)"}
            inputType={"number"}
            value={driveData.businessDistance}
            fieldName="businessDistance"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"주유량(L)"}
            inputType={"number"}
            value={driveData.fuelAmount}
            fieldName="fuelAmount"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"총 운행 수(건)"}
            inputType={"number"}
            value={driveData.totalDrivingCases}
            fieldName="totalDrivingCases"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName={"메모"}
            inputType={"text"}
            value={driveData.memo}
            fieldName="memo"
            onChange={handleInputChange}
          />
          <button onClick={handleNext}>다음</button>
        </div>
      }
    />
  );
};

export default DriveWrite;
