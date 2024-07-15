import { useState } from "react";

export function DynamicInput({
  labelName,
  inputType,
  placeholder,
  value = [],
  fieldName,
  options,
  onChange,
  onSave,
  showEditButton, // 수정 버튼을 보일지 여부를 결정하는 프롭스 추가
}) {
  const [isEditing, setIsEditing] = useState(false); // 수정 상태 관리
  const [customValue, setCustomValue] = useState(""); // 직접 입력 값 상태 관리

  const handleChange = (e) => {
    const newValue =
      inputType === "checkbox" ? e.target.checked : e.target.value;
    onChange(fieldName, newValue); // 필드 이름과 값을 전달
  };

  const handleCheckboxChange = (e, option) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange(fieldName, newValue);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // 수정 버튼 클릭 시 상태 토글
    if (isEditing) {
      onSave(fieldName, value);
    }
  };

  const handleCustomInputChange = (e) => {
    setCustomValue(e.target.value);
  };

  const handleCustomInputSave = () => {
    onSave(fieldName, customValue);
    // onChange(fieldName, customValue);
    // setCustomValue(""); // 입력 후 값 초기화
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
            {showEditButton && (
              <button
                onClick={handleEditToggle}
                className={isEditing ? "savebtn" : "editBtn"}
              >
                {isEditing ? "저장" : "수정"}
              </button>
            )}
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
            {options.includes("직접입력") &&
              isEditing &&
              value === "직접입력" && (
                <div className="etc" style={{ marginLeft: "10px" }}>
                  <input
                    type="text"
                    value={customValue}
                    onChange={handleCustomInputChange}
                    placeholder="직접 입력"
                  />
                </div>
              )}
            {options.includes("직접입력") &&
            isEditing &&
            value === "직접입력" ? (
              <button onClick={handleCustomInputSave}>저장</button>
            ) : (
              showEditButton && (
                <button
                  onClick={handleEditToggle}
                  className={isEditing ? "savebtn" : "editBtn"}
                >
                  {isEditing ? "저장" : "수정"}
                </button>
              )
            )}
          </>
        );
      case "checkbox":
        return (
          <>
            {options.map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, option)}
                  disabled={!isEditing}
                />
                {option}
              </label>
            ))}
            {showEditButton && (
              <button
                onClick={handleEditToggle}
                className={isEditing ? "savebtn" : "editBtn"}
              >
                {isEditing ? "저장" : "수정"}
              </button>
            )}
          </>
        );
      case "date":
        const formattedDate = value
          ? new Date(value).toISOString().substring(0, 10)
          : "";
        return (
          <div>
            <input
              type="date"
              value={formattedDate}
              onChange={handleChange}
              disabled={!isEditing} // 수정 상태에 따라 활성화/비활성화
            />
            {showEditButton && (
              <button
                onClick={handleEditToggle}
                className={isEditing ? "savebtn" : "editBtn"}
              >
                {isEditing ? "저장" : "수정"}
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`dynamicInput ${inputType}Type`}>
      <label>{labelName}</label>
      {renderInput()}
    </div>
  );
}
