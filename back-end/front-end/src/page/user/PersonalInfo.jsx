import axios from "axios";
import React, { useEffect, useState } from "react";

function DynamicInput({
  labelName,
  inputType,
  placeholder,
  value,
  options,
  onChange,
}) {
  const [isEditing, setIsEditing] = useState(false); // 수정 상태 관리

  const handleChange = (e) => {
    if (inputType === "checkbox") {
      onChange(e.target.checked);
    } else {
      onChange(e.target.value);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // 수정 버튼 클릭 시 상태 토글
  };

  const renderInput = () => {
    switch (inputType) {
      case "text":
      case "number":
        return (
          <>
            <input
              type={inputType}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              disabled={!isEditing} // 수정 상태에 따라 활성화/비활성화
            />

            <button
              onClick={handleEditToggle}
              className={isEditing ? "savebtn" : "editBtn"}
            >
              {isEditing ? "저장" : "수정"}
            </button>
          </>
        );
      case "select":
        return (
          <>
            <select value={value} onChange={handleChange} disabled={!isEditing}>
              <option value="">선택하세요</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              onClick={handleEditToggle}
              className={isEditing ? "savebtn" : "editBtn"}
            >
              {isEditing ? "저장" : "수정"}
            </button>
          </>
        );
      case "checkbox":
        return (
          <input type="checkbox" checked={value} onChange={handleChange} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="dynamicInput">
      <label>{labelName}</label>
      {renderInput()}
    </div>
  );
}

const PersonalInfo = () => {
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    birthdate: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  //const [token, setToken] = useState(""); // 로그인 후 받은 토큰 상태
  const token = localStorage.getItem("token"); // 토큰 가져오기
  // 회원 정보 조회 함수
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      //setUserInfo(response.data); // 서버에서 받은 회원 정보 설정
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
            value={userInfo.nickname}
            placeholder={"이름을 입력해주세요."}
          />
          <DynamicInput
            labelName={"생년월일"}
            inputType={"text"}
            placeholder={"생년월일을 입력해주세요."}
          />
        </div>
        <div className="inputWrap">
          <h3>연락처 정보</h3>
          <DynamicInput
            labelName={"이름"}
            inputType={"text"}
            placeholder={"이름을 입력해주세요."}
          />
          <DynamicInput
            labelName={"생년월일"}
            inputType={"text"}
            placeholder={"생년월일을 입력해주세요."}
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
