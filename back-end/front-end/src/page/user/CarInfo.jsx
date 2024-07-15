import React, { useEffect, useState } from "react";
import { DynamicInput } from "../../components/InputBox";
import {
  getJobtype,
  getProfileVehicle,
  getProfilefranchise,
} from "../../components/ApiGet";
import {
  postProfileVehicle,
  postProfilefranchise,
} from "../../components/ApiPost";
import carsData from "../../utils/cars.json";

const FranchiseFee = ({
  carType,
  franchiseFree,
  setFranchiseFree,
  jobtype,
}) => {
  // 차량 종류에 따라 가맹 항목 변경
  let franchises = [];

  // jobtype에 따라 보여질 가맹 항목 설정
  switch (jobtype) {
    case "1": // 택시 관련
      switch (carType) {
        case "택시(중형)":
        case "택시(대형)":
        case "택시(고급)":
          franchises = ["카카오", "우버", "비가맹"];
          break;
        case "택시(승합)":
          franchises = ["카카오벤티", "아이엠", "기타"];
          break;
        default:
          franchises = [];
          break;
      }
      break;
    case "2": // 배달 관련
      switch (carType) {
        case "배달(배민)":
        case "배달(쿠팡)":
        case "배달(퀵)":
        case "배달(화물택배)":
          franchises = [];
          break;
        default:
          franchises = [];
          break;
      }
      break;
    default:
      franchises = [];
      break;
  }

  franchises.map((name) => {
    const match = franchiseFree.find((item) => item.franchise_name === name);
    return {
      franchise_name: name,
      fee: match ? match.fee : 0,
      checked: match ? true : false,
    };
  });

  const [isEditing, setIsEditing] = useState(false); // 수정 상태 관리

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // 수정 버튼 클릭 시 상태 토글
    if (isEditing) {
      handleSaveFranchiseInfo();
    }
  };

  const handleFranchiseChange = (index, field, value) => {
    const updatedFranchiseFree = [...franchiseFree];
    updatedFranchiseFree[index] = {
      ...updatedFranchiseFree[index],
      [field]: value,
    };
    setFranchiseFree(updatedFranchiseFree);
  };

  const handleSaveFranchiseInfo = async () => {
    try {
      // 선택된 가맹 정보만 필터링해서 저장
      const selectedFranchises = franchiseFree.filter(
        (item) => item.checked === true
      );
      await postProfilefranchise("franchise_info", selectedFranchises);
      console.log("가맹 정보 저장 성공!");
    } catch (error) {
      console.error("가맹 정보 저장 실패:", error.message);
    }
  };

  return (
    franchises.length > 0 && (
      <div className="checkboxes">
        <label>가맹 항목</label>
        <div>
          {franchises.map((item, index) => (
            <div key={index} className="franchise-item">
              <input
                type="checkbox"
                checked={item.checked}
                disabled={!isEditing}
                value={item.franchise_name}
                onChange={(e) =>
                  handleFranchiseChange(index, "franchise_name", e.target.value)
                }
              />
              <p>{item.franchise_name}</p>
              <input
                type="number"
                value={item.fee}
                onChange={(e) =>
                  handleFranchiseChange(index, "fee", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleEditToggle}
          className={isEditing ? "savebtn" : "editBtn"}
        >
          {isEditing ? "저장" : "수정"}
        </button>
      </div>
    )
  );
};

const CarInfo = () => {
  const [vehicleInfo, setVehicleInfo] = useState({
    carType: "배달(배민)", //차량종류
    franchise_status: "가맹", // 가맹상태
    vehicle_name: "토요타 프리우스", // 차량 이름
    year: 2020, // 연식
    fuel_type: "LPG", // 연료유형
    mileage: 0, // 누적거리
  });

  const [franchiseFree, setFranchiseFree] = useState([
    { franchise_name: "카카오", fee: 5 },
    { franchise_name: "우버", fee: 3 },
  ]);

  const [jobtype, setJobtype] = useState("2"); // 잡타입 상태

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
    switch (jobtype) {
      case "1": // 택시 관련
        return ["택시(중형)", "택시(대형)", "택시(고급)", "택시(승합)"];
      case "2": // 배달 관련
        return ["배달(배민)", "배달(쿠팡)", "배달(퀵)", "배달(화물택배)"];
      default:
        return [];
    }
  };
  //회원정보 불러오기
  useEffect(() => {
    const getUserData = async () => {
      try {
        const vehicleData = await getProfileVehicle();
        setVehicleInfo(vehicleData);
        const franchiseData = await getProfilefranchise();
        setFranchiseFree(franchiseData);
        const jobtypeData = await getJobtype();
        setJobtype(jobtypeData);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUserData();
  }, []);

  //회원정보 보내기
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
          <FranchiseFee
            carType={vehicleInfo.carType}
            franchiseFree={franchiseFree}
            jobtype={jobtype}
            setFranchiseFree={setFranchiseFree}
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
            options={["LPG", "전기", "직접입력"]}
            value={vehicleInfo.franchise_status}
            fieldName="franchise_status"
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
              flex-wrap: wrap;
              flex-direction: column;
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
                  width: 15%;
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
              text-algin: left;
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
