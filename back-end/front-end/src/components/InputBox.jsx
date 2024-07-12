import { useState } from "react";

export function DynamicInput({
  labelName,
  inputType,
  placeholder,
  value,
  fieldName,
  options,
  onChange,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false); // 수정 상태 관리

  const handleChange = (e) => {
    const newValue =
      inputType === "checkbox" ? e.target.checked : e.target.value;
    onChange(fieldName, newValue); // 필드 이름과 값을 전달
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // 수정 버튼 클릭 시 상태 토글
    if (isEditing) {
      onSave(fieldName, value);
    }
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
