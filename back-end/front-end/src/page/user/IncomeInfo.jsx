import React, { useEffect, useState } from "react";
import { DynamicInput } from "../../components/InputBox";
import { getProfileIncome } from "../../components/ApiGet";
import { postProfileIncome } from "../../components/ApiPost";
import locationData from "../../utils/locations.json"; // location.json 파일 import
import { validateDate } from "../../components/Validators";
const IncomeInfo = () => {
  const [userInfo, setUserInfo] = useState({
    income_type: "소득구분",
    start_date: "2024-07-14",
    region1: "서울특별시",
    region2: "강남구",
    monthly_payment: 3000000,
    fuel_allowance: 200000,
    investment: 500000,
    standard_expense_rate: 10.5,
  });

  //회원정보 불러오기
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getProfileIncome();
        setUserInfo(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUserData();
  }, []);

  //회원정보 보내기
  const handleSaveUserInfo = async (field, value) => {
    if (field === "start_date" && !validateDate(value)) {
      alert("유효한 날짜 형식이 아닙니다.");
      return;
    }

    try {
      await postProfileIncome(field, value);
      console.log("회원 정보 저장 성공!");
    } catch (error) {
      console.error("회원 정보 저장 실패:", error.message);
    }
  };

  // Input 값 변경 함수
  const handleInputChange = (field, value) => {
    console.log(value);
    if (field === "standard_expense_rate") {
      // 입력된 값이 숫자이고, 소수점 이하 두 자리까지만 허용하는 정규식
      const regex = /^\d*\.?\d{0,2}$/;
      if (!regex.test(value)) return; // 정규식 통과하지 못하면 업데이트 중지
    }

    setUserInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className="container userInfo">
      <h2>
        회원정보 <span>소득정보</span>
      </h2>

      <div className="content">
        <div className="inputWrap">
          <h3>소득 구분</h3>
          <DynamicInput
            labelName={"소득 구분"}
            inputType={"select"}
            options={["개인사업자", "근로소득자"]}
            value={userInfo.income_type}
            fieldName="income_type"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"개업일/취업일"}
            inputType={"number"}
            value={userInfo.start_date}
            fieldName="start_date"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
            maxLength={8}
          />
        </div>
        <div className="inputWrap">
          <h3>지역 정보</h3>
          <DynamicInput
            labelName={"지역1"}
            inputType={"select"}
            options={locationData.provinces.map((province) => province.name)}
            value={userInfo.region1}
            fieldName="region1"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"지역2"}
            inputType={"select"}
            options={
              locationData.provinces.find(
                (province) => province.name === userInfo.region1
              )?.cities || []
            }
            value={userInfo.region2}
            fieldName="region2"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
        </div>
        <div className="inputWrap">
          <h3>가맹 지출</h3>
          <DynamicInput
            labelName={"월사납금"}
            inputType={"number"}
            placeholder={"숫자로 입력해주세요."}
            value={userInfo.monthly_payment}
            fieldName="monthly_payment"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"연료지급"}
            inputType={"number"}
            placeholder={"숫자로 입력해주세요."}
            value={userInfo.fuel_allowance}
            fieldName="fuel_allowance"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
        </div>
        <div className="inputWrap">
          <h3>개인 지출</h3>
          <DynamicInput
            labelName={"투자금"}
            inputType={"number"}
            placeholder={"숫자로 입력해주세요."}
            value={userInfo.investment}
            fieldName="investment"
            onChange={handleInputChange}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"기준경비율"}
            inputType={"number"}
            placeholder={"숫자로 입력해주세요."}
            value={userInfo.standard_expense_rate}
            fieldName="standard_expense_rate"
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
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
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
          .dynamicInput {
            border-bottom: 1px solid #c1c1c1;
            width: 100%;
            height: 50px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            label {
              font-size: 14px;
              color: #c1c1c1;
              width: 15%;
              @media (max-width: 768px) {
                width: 25%;
              }
            }
            input {
              font-size: 14px;
              color: #c1c1c1;
              border: none;
              width: 75%;
              height: 100%;
              text-algin: left;
              background: none;
              @media (max-width: 768px) {
                width: 60%;
              }
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
              @media (max-width: 768px) {
                width: 50%;
              }
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
              text-align: center;
              &.savebtn {
                border-color: rgb(100 255 0);
                color: rgb(100 255 0);
              }
            }
          }
          }
        }
      `}</style>
    </div>
  );
};
export default IncomeInfo;
