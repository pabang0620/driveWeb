import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { postDrive } from "../../components/ApiPost";
import DriveIncome from "./DriveIncome";

const DriveWrite = ({ showModal, toggleModal }) => {
  const [showDriveIncome, setShowDriveIncome] = useState(false); // DriveIncome 보이기 여부 상태 추가

  const [dirveData, setDriveData] = useState({
    memo: "string",
    startTime: "2024-07-14T11:23:44.658Z",
    endTime: "2024-07-14T11:23:44.658Z",
    cumulativeKm: 20, //누적 주행 거리.
    businessDistance: 10, //영업거리
    fuelAmount: 10, //주유량
    totalDrivingCases: 30, //총운행건수
  });
  // const getData = async (url) => {
  //   const token = getToken();
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(`회원 정보 조회 실패: ${error.message}`);
  //   }
  // };
  const handleNext = () => {
    const postDriveData = async () => {
      try {
        const response = await postDrive(dirveData);
        // 로그인 성공 후 토큰을 로컬 스토리지에 저장
        localStorage.setItem("drivingLogId", response.data.drivingLogId);
        console.log(response.data.drivingLogId);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    postDriveData(); //운행일지생성
    setShowDriveIncome(true); // 다음 버튼 클릭 시 DriveExpense 보이기
  };

  // Input 값 변경 함수
  const handleInputChange = (field, value) => {
    console.log(value);
    setDriveData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // //운행일지-운행 가져오기
  // useEffect(() => {
  //   try {
  //     const fetchData = async () => {
  //       try {
  //         const response = await getDrive();
  //         setDirveData(response.data);
  //       } catch (error) {
  //         console.error("Error fetching data: ", error);
  //       }
  //     };
  //     fetchData();
  //   } catch {}
  // });

  const driveInputBox = () => {
    return (
      <div className="drive">
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
        <DynamicInput
          labelName={"메모"}
          inputType={"text"}
          value={dirveData.memo}
          fieldName="memo"
          onChange={handleInputChange}
          placeholder={"메모를 입력해주세요."}
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
