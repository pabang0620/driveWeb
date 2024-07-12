import axios from "axios";
import React, { useEffect, useState } from "react";
import { DynamicInput } from "../../components/InputBox";

const PersonalInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "test",
    birth_date: "2024-07-12",
    phone: "010-1111-1111",
    email: "test@test.com",
    nickname: "",
  });
  const token = localStorage.getItem("token"); // 토큰 가져오기

  // 회원 정보 조회 함수
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data); // 서버에서 받은 회원 정보 설정
      console.log(response.data);
    } catch (error) {
      console.error("회원 정보 조회 실패:", error.message);
    }
  };
  useEffect(() => {
    // 페이지 로드 시 회원 정보 조회
    if (token) {
      fetchUserProfile();
    }
  }, []);

  // 회원 정보 보내기 함수
  const handlePostUserProfile = async (field, value) => {
    console.log({ [field]: value });
    try {
      const response = await axios.post(
        "/api/user/profile",
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("회원 정보 보내기 실패?:", error.message);
    }
  };

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
        회원정보 <span>개인정보 수정</span>
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
            onSave={handlePostUserProfile}
          />
          <DynamicInput
            labelName={"생년월일"}
            inputType={"text"}
            value={userInfo.birth_date}
            fieldName="birth_date"
            onChange={handleInputChange}
            placeholder={"생년월일을 입력해주세요."}
            onSave={handlePostUserProfile}
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
            onSave={handlePostUserProfile}
          />
          <DynamicInput
            labelName={"이메일"}
            inputType={"text"}
            value={userInfo.email}
            fieldName="email"
            onChange={handleInputChange}
            placeholder={"이메일을 입력해주세요."}
            onSave={handlePostUserProfile}
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
              font-size: 14px;
              border: 1px solid #4c4c4c;
              color: #4c4c4c;
              border-radius: 5px;
              padding: 5px 7px 3px 7px;

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
export default PersonalInfo;
