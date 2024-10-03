import React, { useEffect, useState } from "react";
import { DynamicInput } from "../../components/InputBox";
import { getJobtype, getProfileIncome } from "../../components/ApiGet";
import { postProfileIncome } from "../../components/ApiPost";
import locationData from "../../utils/locations.json"; // location.json 파일 import
import { validateDate } from "../../components/Validators";
import TitleBox from "../../components/TitleBox";
import useCheckPermission from "../../utils/useCheckPermission";
import JobTypeComponent from "./JobTypeComponent";
import "./user.scss";

const IncomeInfo = () => {
  useCheckPermission();
  const [jobtype, setJobtype] = useState(""); // 잡타입 상태

  useEffect(() => {
    const fetchJobType = async () => {
      try {
        const jobtypeData = await getJobtype(); // 잡타입 데이터 가져오기
        console.log("Job Type Data:", jobtypeData);
        setJobtype(jobtypeData); // 잡타입 상태 설정
      } catch (error) {
        console.error("Failed to fetch job type:", error);
      }
    };

    fetchJobType();
  }, []);
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
  if (jobtype === null) {
    // 차량 종류가 비어있을 경우 메시지 표시
    return <JobTypeComponent />;
  }
  return (
    <div className="container userInfoIncome">
      <TitleBox title="회원정보" subtitle="소득정보" />

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
            placeholder={"날짜를 입력해주세요."}
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
    </div>
  );
};
export default IncomeInfo;
