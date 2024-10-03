import React, { useEffect, useState } from "react";
import { DynamicInput } from "../../components/InputBox";
import { getJobtype, getProfileVehicle } from "../../components/ApiGet";
import { postProfileVehicle } from "../../components/ApiPost";
import carsData from "../../utils/cars.json";
import FranchiseFee from "./FranchiseFee";
import Spinner from "../../components/Spinner"; // 스피너 컴포넌트 가져오기
import TitleBox from "../../components/TitleBox";
import useCheckPermission from "../../utils/useCheckPermission";
import JobTypeComponent from "./JobTypeComponent";
import "./user.scss";

const CarInfo = () => {
  useCheckPermission();

  const [vehicleInfo, setVehicleInfo] = useState({
    carType: "", // 차량종류
    franchise_status: "", // 가맹상태
    vehicle_name: "", // 차량 이름
    year: 0, // 연식
    fuel_type: "", // 연료유형
    mileage: 0, // 누적거리
  });
  const [jobtype, setJobtype] = useState(""); // 잡타입 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // 시작 연도와 끝 연도 정의
  const startYear = 2014; // 연도 범위의 시작 연도
  const endYear = new Date().getFullYear(); // 현재 연도

  // 연도 옵션 설정
  const yearOptions = Array.from(
    // 연도 범위 길이 만큼 배열 생성
    { length: endYear - startYear + 1 },
    // 각 요소를 시작 연도부터 현재 연도까지의 연도로 초기화
    (_, index) => startYear + index
  );

  // 차량 종류 옵션 설정
  const getCarTypeOptions = () => {
    const defaultOptions = [
      "택시(중형)",
      "택시(대형)",
      "택시(고급)",
      "택시(승합)",
    ];
    switch (jobtype) {
      case "1": // 택시 관련
        return defaultOptions;
      case "2": // 배달 관련
        return ["배달(배민)", "배달(쿠팡)", "배달(퀵)", "배달(화물택배)"];
      default:
        return defaultOptions; // 기본 옵션 설정
    }
  };

  // 회원정보 불러오기
  useEffect(() => {
    const getUserData = async () => {
      try {
        const vehicleData = await getProfileVehicle();
        console.log("Vehicle Data:", vehicleData);
        setVehicleInfo(vehicleData);
        const jobtypeData = await getJobtype();
        console.log("Job Type Data:", jobtypeData);
        setJobtype(jobtypeData);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };
    getUserData();
  }, []);

  // 회원정보 보내기
  const handleSaveUserInfo = async (field, value) => {
    try {
      await postProfileVehicle(field, value);
      console.log("회원 정보 저장 성공!");
    } catch (error) {
      console.error("회원 정보 저장 실패:", error.message);
    }
  };

  // Input 값 변경 함수
  const handleInputChange = (field, value) => {
    console.log(value);
    setVehicleInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  if (loading) {
    return <Spinner />; // 로딩 중일 때 스피너 표시
  }
  if (jobtype === null) {
    // 차량 종류가 비어있을 경우 메시지 표시
    return <JobTypeComponent />;
  }
  return (
    <div className="container userInfoCar">
      <TitleBox title="회원정보" subtitle="차량정보" />
      <div className="content">
        <div className="inputWrap">
          <h3>차량구분</h3>
          <DynamicInput
            labelName={"차량 구분"}
            inputType={"select"}
            options={getCarTypeOptions()}
            value={vehicleInfo.carType}
            fieldName="carType"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"가맹 여부"}
            inputType={"select"}
            options={["가맹", "비가맹"]}
            value={vehicleInfo.franchise_status}
            fieldName="franchise_status"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <FranchiseFee
            carType={vehicleInfo.carType}
            jobtype={jobtype}
            status={vehicleInfo.franchise_status}
          />
        </div>
        <div className="inputWrap">
          <h3>차량 정보</h3>
          <DynamicInput
            labelName={"차명"}
            inputType={"select"}
            options={[...carsData.taxiVehicles, "직접입력"]}
            value={vehicleInfo.vehicle_name}
            fieldName="vehicle_name"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"연식"}
            inputType={"select"}
            options={[...yearOptions]}
            value={vehicleInfo.year}
            fieldName="year"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"연료"}
            inputType={"select"}
            options={[
              "LPG",
              "전기",
              "휘발유",
              "경유",
              "하이브리드",
              "직접입력",
            ]}
            value={vehicleInfo.fuel_type}
            fieldName="fuel_type"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"누적주행거리"}
            inputType={"number"}
            placeholder={"숫자로 입력해주세요."}
            value={vehicleInfo.mileage}
            fieldName="mileage"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CarInfo;
