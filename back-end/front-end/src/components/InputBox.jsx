import { useState } from "react";

export function DynamicInput({
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
