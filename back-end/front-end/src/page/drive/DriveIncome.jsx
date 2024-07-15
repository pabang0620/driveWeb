import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { getDrive } from "../../components/ApiGet";
import { postDrive } from "../../components/ApiPost";
import DriveExpense from "./DriveExpense";

const DriveIncome = ({ showModal, toggleModal }) => {
  const [showDriveExpense, setShowDriveExpense] = useState(false); // DriveExpense 보이기 여부 상태 추가

  const [dirveIncomeData, setDriveIncomeData] = useState({
    drivingLogId: 0,
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

  const hadleNext = () => {
    setShowDriveExpense(true); // 다음 버튼 클릭 시 DriveExpense 보이기
  };
  //운행일지-수입 보내기
  const handleSaveUserInfo = async () => {
    try {
      // await postDrive(dirveData);
      console.log("운행일지-운행 보내기 성공!");
      setShowDriveExpense(true); // 다음 버튼 클릭 시 DriveExpense 보이기
    } catch (error) {
      console.error("운행일지-운행 보내기 실패:", error.message);
    }
  };

  // Input 값 변경 함수
  const handleInputChange = (field, value) => {
    console.log(value);
    dirveIncomeData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  //운행일지-수입 가져오기
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
          labelName={"카드"}
          inputType={"number"}
          value={dirveIncomeData.cardIncome}
          fieldName="cardIncome"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"현금"}
          inputType={"number"}
          value={dirveIncomeData.cashIncome}
          fieldName="cashIncome"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"카카오"}
          inputType={"number"}
          value={dirveIncomeData.kakaoIncome}
          fieldName="kakaoIncome"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"우버"}
          inputType={"number"}
          value={dirveIncomeData.uberIncome}
          fieldName="uberIncome"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"온다"}
          inputType={"number"}
          value={dirveIncomeData.ondaIncome}
          fieldName="ondaIncome"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"타다"}
          inputType={"number"}
          value={dirveIncomeData.tadaIncome}
          fieldName="tadaIncome"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"잡수입"}
          inputType={"number"}
          value={dirveIncomeData.otherIncome}
          fieldName="otherIncome"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"수입예비1"}
          inputType={"number"}
          value={dirveIncomeData.incomeSpare1}
          fieldName="fuelAmount"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"수입예비2"}
          inputType={"number"}
          value={dirveIncomeData.incomeSpare2}
          fieldName="totalDrivingCases"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"수입예비3"}
          inputType={"number"}
          value={dirveIncomeData.incomeSpare3}
          fieldName="fuelAmount"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <DynamicInput
          labelName={"수입예비4"}
          inputType={"number"}
          value={dirveIncomeData.incomeSpare4}
          fieldName="totalDrivingCases"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
          onSave={handleSaveUserInfo}
        />
        <button onClick={hadleNext}>다음</button>
      </div>
    );
  };

  return (
    <Modal
      showModal={showModal}
      toggleModal={toggleModal}
      number={2}
      title={"수입"}
      content={
        showDriveExpense ? (
          <DriveExpense toggleModal={toggleModal} />
        ) : (
          driveInputBox()
        )
      }
    />
  );
};
export default DriveIncome;
