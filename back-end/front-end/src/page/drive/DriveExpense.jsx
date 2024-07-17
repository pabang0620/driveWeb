import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { getDrive } from "../../components/ApiGet";
import { postDrive } from "../../components/ApiPost";

const DriveExpense = ({ showModal, toggleModal }) => {
  const [dirveExpenseData, setDriveExpenseData] = useState({
    drivingLogId: 0,
    fuelCost: 0,
    tollCost: 0,
    mealCost: 0,
    fineCost: 0,
    otherExpense: 0,
    expenseSpare1: 0,
    expenseSpare2: 0,
    expenseSpare3: 0,
    expenseSpare4: 0,
  });

  //운행일지-수입 보내기
  const handleSaveUserInfo = async (dirveData) => {
    try {
      // await postDrive(dirveData);
      console.log("운행일지-운행 보내기 성공!");
    } catch (error) {
      console.error("운행일지-운행 보내기 실패:", error.message);
    }
  };

  // Input 값 변경 함수
  const handleInputChange = (field, value) => {
    console.log(value);
    setDriveExpenseData((prevState) => ({
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
      <div className="drive">
        <DynamicInput
          labelName={"주유비"}
          inputType={"number"}
          value={dirveExpenseData.fuelCost}
          fieldName="fuelCost"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"통행료"}
          inputType={"number"}
          value={dirveExpenseData.tollCost}
          fieldName="fuelCost"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"식대"}
          inputType={"number"}
          value={dirveExpenseData.mealCost}
          fieldName="mealCost"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"과태료"}
          inputType={"number"}
          value={dirveExpenseData.fineCost}
          fieldName="fineCost"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"기타지출"}
          inputType={"number"}
          value={dirveExpenseData.otherExpense}
          fieldName="otherExpense"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"지출예비1"}
          inputType={"number"}
          value={dirveExpenseData.expenseSpare1}
          fieldName="expenseSpare1"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"지출예비2"}
          inputType={"number"}
          value={dirveExpenseData.expenseSpare2}
          fieldName="expenseSpare2"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"지출예비3"}
          inputType={"number"}
          value={dirveExpenseData.expenseSpare3}
          fieldName="expenseSpare3"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <DynamicInput
          labelName={"지출예비4"}
          inputType={"number"}
          value={dirveExpenseData.expenseSpare4}
          fieldName="expenseSpare4"
          onChange={handleInputChange}
          placeholder={"숫자로 입력해주세요."}
        />
        <button onClick={toggleModal}>저장</button>
      </div>
    );
  };

  return (
    <Modal
      showModal={showModal}
      toggleModal={toggleModal}
      number={3}
      title={"지출"}
      content={driveInputBox()}
    />
  );
};
export default DriveExpense;
