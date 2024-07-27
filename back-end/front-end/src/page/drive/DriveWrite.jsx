import React, { useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { postDrive } from "../../components/ApiPost";

const DriveWrite = ({ showModal, toggleModal, closeModal }) => {
  const [driveData, setDriveData] = useState({
    date: "",
    memo: "",
    start_time: "",
    end_time: "",
    cumulative_km: 0,
    business_distance: 0,
    fuel_amount: 0,
    total_driving_cases: 0,
  });

  const handleNext = async () => {
    if (validateForm()) {
      try {
        const response = await postDrive(driveData);
        console.log("Response data:", response); // 응답 데이터 확인
        localStorage.setItem("drivingLogId", response.driving_log_id);
        closeModal(false); // 확인 메시지 없이 모달 닫기
        toggleModal(); // 다음 모달 열기
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setDriveData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = {
      date: "운행날짜",
      start_time: "시작시간",
      end_time: "종료시간",
      cumulative_km: "누적거리",
      business_distance: "영업거리",
      fuel_amount: "주유량",
      total_driving_cases: "총 운행 수",
    };

    for (let field in requiredFields) {
      if (!driveData[field]) {
        alert(`항목을 입력해주세요: ${requiredFields[field]}`);
        return false;
      }
    }
    return true;
  };

  return (
    <Modal
      closeModal={closeModal}
      showModal={showModal}
      toggleModal={toggleModal}
      number={1}
      title={"운행일지"}
      content={
        <div className="drive">
          <DynamicInput
            labelName="운행날짜"
            inputType="date"
            value={driveData.date}
            fieldName="date"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="시작시간"
            inputType="time"
            value={driveData.start_time}
            fieldName="start_time"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="종료시간"
            inputType="time"
            value={driveData.end_time}
            fieldName="end_time"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="누적거리(km)"
            inputType="number"
            value={driveData.cumulative_km}
            fieldName="cumulative_km"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="영업거리(km)"
            inputType="number"
            value={driveData.business_distance}
            fieldName="business_distance"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="주유량(L)"
            inputType="number"
            value={driveData.fuel_amount}
            fieldName="fuel_amount"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="총 운행 수(건)"
            inputType="number"
            value={driveData.total_driving_cases}
            fieldName="total_driving_cases"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="메모"
            inputType="text"
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
