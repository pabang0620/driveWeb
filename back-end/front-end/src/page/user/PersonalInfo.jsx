import React, { useEffect, useState } from "react";
import { DynamicInput } from "../../components/InputBox";
import { getProfile, getJobtype } from "../../components/ApiGet";
import { postUserProfile } from "../../components/ApiPost";
import { validatePhone, validateEmail } from "../../components/Validators";

const PersonalInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "test",
    birth_date: "2024-07-12",
    phone: "010-1111-1111",
    username: "test@test.com",
  });

  //회원정보 불러오기
  useEffect(() => {
    const getUserData = async () => {
      try {
        getJobtype();
        const data = await getProfile();
        setUserInfo(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUserData();
  }, []);

  //회원정보 보내기
  const handleSaveUserInfo = async (field, value) => {
    try {
      if (field === "phone" && !validatePhone(value)) {
        alert("유효한 휴대폰 번호 형식이 아닙니다.");
        return;
      }
      if (field === "username" && !validateEmail(value)) {
        alert("유효한 이메일 형식이 아닙니다.");
        return;
      }
      await postUserProfile(field, value);
      console.log("회원 정보 저장 성공!");
    } catch (error) {
      console.error("회원 정보 저장 실패:", error.message);
    }
  };

  // Input 값 변경 함수
  const handleInputChange = (field, value) => {
    console.log(value);
    setUserInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className="container userInfo">
      <h2>
        회원정보 <span>개인정보</span>
      </h2>
      <div className="content">
        <div className="inputWrap">
          <h3>기본정보</h3>
          <DynamicInput
            labelName={"이름"}
            inputType={"text"}
            value={userInfo.name}
            fieldName="name"
            onChange={handleInputChange}
            placeholder={"이름을 입력해주세요."}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"생년월일"}
            inputType={"text"}
            value={userInfo.birth_date}
            fieldName="birth_date"
            onChange={handleInputChange}
            placeholder={"생년월일을 입력해주세요."}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
        </div>
        <div className="inputWrap">
          <h3>연락처 정보</h3>
          <DynamicInput
            labelName={"휴대폰"}
            inputType={"text"}
            value={userInfo.phone}
            fieldName="phone"
            onChange={handleInputChange}
            placeholder={"휴대폰 번호를 입력해주세요."}
            onSave={handleSaveUserInfo}
            showEditButton={true}
          />
          <DynamicInput
            labelName={"이메일"}
            inputType={"text"}
            value={userInfo.username}
            fieldName="username"
            onChange={handleInputChange}
            placeholder={"이메일을 입력해주세요."}
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
          .dynamicInput {
            border-bottom: 1px solid #c1c1c1;
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            label {
              font-size: 14px;
              color: #c1c1c1;
              width: 15%;
            }
            input {
              font-size: 14px;
              color: #c1c1c1;
              border: none;
              width: 75%;
              margin-right: 5%;
              height: 100%;
              text-algin: left;
              background: none;
              &:focus {
                border: none;
                outline: none;
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
export default PersonalInfo;
