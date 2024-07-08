import React, { useState } from "react";

function DynamicInput({ labelName, inputType, value, options, onChange }) {
  const handleChange = (e) => {
    if (inputType === "checkbox") {
      onChange(e.target.checked);
    } else {
      onChange(e.target.value);
    }
  };

  const renderInput = () => {
    switch (inputType) {
      case "text":
      case "number":
        return (
          <div>
            <label htmlFor="">{labelName}</label>
            <input type={inputType} value={value} onChange={handleChange} />
          </div>
        );
      case "select":
        return (
          <select value={value} onChange={handleChange}>
            <option value="">선택하세요</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
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
    <div>
      <label>{labelName}</label>
      {renderInput()}
    </div>
  );
}

const PersonalInfo = () => {
  return (
    <div className="container userInfo">
      <h2>
        회원정보 <span>개인정보 수정</span>
      </h2>
      <div className="content"></div>
      <style jsx>{`
        .userInfo {
          width: 80%;
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
        }
      `}</style>
    </div>
  );
};
export default PersonalInfo;
