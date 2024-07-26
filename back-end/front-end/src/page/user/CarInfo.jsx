import React, { useEffect, useState } from "react";
import { DynamicInput } from "../../components/InputBox";
import { getJobtype, getProfileVehicle } from "../../components/ApiGet";
import { postProfileVehicle } from "../../components/ApiPost";
import carsData from "../../utils/cars.json";
import FranchiseFee from "./FranchiseFee";
import Spinner from "../../components/Spinner"; // 스피너 컴포넌트 가져오기

const CarInfo = () => {
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

  return (
    <div className="container userInfo">
      <h2>
        회원정보 <span>차량정보</span>
      </h2>

      <div className="content">
        <div className="inputWrap">
          <h3>차량정보</h3>
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
          {vehicleInfo.franchise_status === "가맹" && (
            <FranchiseFee carType={vehicleInfo.carType} jobtype={jobtype} />
          )}
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
            options={["LPG", "전기", "직접입력"]}
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
      <style jsx>{`
        .userInfo {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;

          h2 {
            font-size: 25px;
            font-weight: 600;
            span {
              font-size: 20px;
              color: #4c4c4c;
              margin-left: 10px;
            }
          }
          .inputWrap {
            margin-top: 30px;
          }
          h3 {
            font-size: 16px;
            color: #4c4c4c;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .checkboxes {
            width: 100%;
            border: none;
            font-size: 14px;
            color: #c1c1c1;
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;

            > label {
              font-size: 14px;
              color: #c1c1c1;
              width: 15%;
              line-height: 50px;
            }

            > div {
              width: 80%;
              height: 100%;
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              .franchise-item {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                align-items: center;
                gap: 5px;
                height: 50px;
                p {
                }
                label:first-child {
                  display: none;
                }
                input[type="number"] {
                  border-radius: 5px;
                  border: 1px solid #d9d9d9;
                  padding: 5px;
                }
              }
            }
            > button {
              margin-left: auto;
              cursor: pointer;
              font-size: 14px;
              border: 1px solid #4c4c4c;
              color: #4c4c4c;
              border-radius: 5px;
              width: 40px;
              height: 25px;
              text-align: center;
              &.savebtn {
                border-color: rgb(100 255 0);
                color: rgb(100 255 0);
              }
            }
          }

          .dynamicInput {
            border-bottom: 1px solid #c1c1c1;
            width: 100%;
            height: 50px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            font-size: 14px;
            color: #c1c1c1;

            label:first-child {
              font-size: 14px;
              color: #c1c1c1;
              width: 15%;
            }
            input {
              font-size: 14px;
              color: #c1c1c1;
              border: none;
              width: 75%;
              height: 100%;
              text-align: left;
              background: none;
              &:focus {
                border: none;
                outline: none;
                color: #222;
              }
            }

            select {
              height: 70%;
              width: 20%;
              color: #c1c1c1;
              border: 1px solid #c1c1c1;
              border-radius: 3px;
              padding: 5px;
              &:focus {
                outline: 1px solid #c1c1c1;
                color: #222;
              }
            }

            button {
              margin-left: auto;
              cursor: pointer;
              font-size: 14px;
              border: 1px solid #4c4c4c;
              color: #4c4c4c;
              border-radius: 5px;
              width: 40px;
              height: 25px;

              &.savebtn {
                border-color: rgb(100 255 0);
                color: rgb(100 255 0);
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default CarInfo;
