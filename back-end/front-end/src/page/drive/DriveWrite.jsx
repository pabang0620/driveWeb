import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { getDrive } from "../../components/ApiGet";
import { postDrive } from "../../components/ApiPost";
import DriveIncome from "./DriveIncome";

const DriveWrite = ({ showModal, toggleModal }) => {
  const [showDriveIncome, setShowDriveIncome] = useState(false); // DriveIncome 보이기 여부 상태 추가

  const [dirveData, setDriveData] = useState({
    drivingLogId: 0,
    startTime: "2024-07-14T11:23:44.658Z",
    endTime: "2024-07-14T11:23:44.658Z",
    cumulativeKm: 20, //누적 주행 거리.
    businessDistance: 10, //영업거리
    fuelAmount: 10, //주유량
    totalDrivingCases: 30, //총운행건수
  });

  const handleNext = () => {
    setShowDriveIncome(true); // 다음 버튼 클릭 시 DriveExpense 보이기
  };
  //운행일지-운행 보내기
  const handleSaveUserInfo = async () => {
    try {
      setShowDriveIncome(true); // 다음 버튼 클릭 시 DriveExpense 보이기
      // await postDrive(dirveData);
      console.log("운행일지-운행 보내기 성공!");
    } catch (error) {
      console.error("운행일지-운행 보내기 실패:", error.message);
    }
  };

  // Input 값 변경 함수
  const handleInputChange = (field, value) => {
    console.log(value);
    setDriveData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  //운행일지-운행 가져오기
  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          //const response = await getDrive();
          //setData(response.data);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
      fetchData();
    } catch {}
  });

  const driveInputBox = () => {
    return (
      <div>
        <DynamicInput
          labelName={"시작시간"}
          inputType={"date"}
          value={dirveData.startTime}
          fieldName="startTime"
          onChange={handleInputChange}
        />
        <DynamicInput
          labelName={"종료시간"}
          inputType={"date"}
          value={dirveData.endTime}
          fieldName="endTime"
          onChange={handleInputChange}
        />
        <DynamicInput
          labelName={"누적거리(km)"}
          inputType={"text"}
          value={dirveData.cumulativeKm}
          fieldName="cumulativeKm"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"영업거리(km)"}
          inputType={"number"}
          value={dirveData.businessDistance}
          fieldName="businessDistance"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"주유량(L)"}
          inputType={"number"}
          value={dirveData.fuelAmount}
          fieldName="fuelAmount"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"총 운행 수(건)"}
          inputType={"number"}
          value={dirveData.totalDrivingCases}
          fieldName="totalDrivingCases"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <button onClick={handleNext}>다음</button>
      </div>
    );
  };

  return (
    <Modal
      showModal={showModal}
      toggleModal={toggleModal}
      number={1}
      title={"운행일지"}
      content={
        showDriveIncome ? (
          <DriveIncome toggleModal={toggleModal} />
        ) : (
          driveInputBox()
        )
      }
    />
  );
};
export default DriveWrite;
