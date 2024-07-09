import React, { useState } from "react";

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
              <option value="">선택</option>
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

const CarInfo = () => {
  return (
    <div className="container userInfo">
      <h2>
        회원정보 <span>개인정보 수정</span>
      </h2>

      <div className="content">
        <div className="inputWrap">
          <h3>차량정보</h3>
          <DynamicInput
            labelName={"차량 구분"}
            inputType={"select"}
            options={["가맹", "비가맹"]}
          />
          <DynamicInput
            labelName={"가맹 여부"}
            inputType={"select"}
            options={["가맹", "비가맹"]}
          />
        </div>
        <div className="inputWrap">
          <h3>차량 정보</h3>
          <DynamicInput
            labelName={"차명"}
            inputType={"select"}
            options={["가맹", "비가맹"]}
          />
          <DynamicInput
            labelName={"연식"}
            inputType={"select"}
            options={["가맹", "비가맹"]}
          />
          <DynamicInput
            labelName={"연료"}
            inputType={"select"}
            options={["가맹", "비가맹"]}
          />
          <DynamicInput
            labelName={"누적주행거리"}
            inputType={"number"}
            placeholder={"숫자로 입력해주세요."}
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
            flex-wrap: wrap;
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
export default CarInfo;
