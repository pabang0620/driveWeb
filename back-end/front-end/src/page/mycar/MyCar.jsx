import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import useCheckPermission from "../../utils/useCheckPermission";
import "./mycar.scss";

const MyCar = () => {
  useCheckPermission();

  const token = localStorage.getItem("token");
  const [image, setImage] = useState(null);
  const [carInfo, setCarInfo] = useState({
    vehicle_name: "",
    year: "",
    fuel_type: "",
    mileage: "",
    license_plate: "",
    first_registration_date: "",
    insurance_company: "",
    insurance_period_start: "",
    insurance_period_end: "",
    insurance_fee: "",
    imageUrl: "", // 이미지 URL 필드 추가
  });

  const [editStates, setEditStates] = useState({
    vehicle_name: false,
    year: false,
    fuel_type: false,
    mileage: false,
    license_plate: false,
    first_registration_date: false,
    insurance_company: false,
    insurance_period: false,
    insurance_fee: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/mycar", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setCarInfo({
          ...data,
          first_registration_date: formatDate(data.first_registration_date),
          insurance_period_start: formatDate(data.insurance_period_start),
          insurance_period_end: formatDate(data.insurance_period_end),
        });
        setImage(data.imageUrl);
      } catch (error) {
        console.error("There was an error fetching the car data:", error);
      }
    };

    fetchData();
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const maxSize = 500 * 1024; // 500KB

    if (file && file.size > maxSize) {
      alert("파일 크기는 500KB를 초과할 수 없습니다.");
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append("images", file);

      try {
        const response = await axios.put("/api/mycar/image", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setImage(URL.createObjectURL(file));
        setCarInfo((prevInfo) => ({
          ...prevInfo,
          imageUrl: response.data.imageUrl,
        }));
      } catch (error) {
        console.error("There was an error uploading the image:", error);
      }
    }
  };

  const handleEditClick = async (field) => {
    if (editStates[field]) {
      try {
        let data;
        if (field === "insurance_period") {
          data = {
            insurance_period_start: new Date(
              carInfo.insurance_period_start
            ).toISOString(),
            insurance_period_end: new Date(
              carInfo.insurance_period_end
            ).toISOString(),
          };
        } else {
          data = {
            [field]: field.includes("date")
              ? new Date(carInfo[field]).toISOString()
              : carInfo[field],
          };
        }
        await axios.put("/api/mycar", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Data updated successfully");
      } catch (error) {
        console.error("There was an error updating the data:", error);
      }
    }
    setEditStates((prevStates) => ({
      ...prevStates,
      [field]: !prevStates[field],
    }));
  };

  const handleChange = (field, value) => {
    let newValue = value;

    // 데이터 타입에 맞게 변환
    if (field === "year" || field === "mileage") {
      newValue = parseInt(value, 10);
    } else if (field === "insurance_fee") {
      newValue = parseFloat(value);
    }

    setCarInfo((prevInfo) => ({
      ...prevInfo,
      [field]: newValue,
    }));
  };

  return (
    <div className="myCar">
      <TitleBox title="차계부" subtitle=" 차량정보" />
      <div className="car-info">
        <div
          className="car-image"
          onClick={() => document.getElementById("imageInput").click()}
        >
          {image ? (
            <img src={image} alt="Car" />
          ) : (
            <div className="upload-placeholder">
              <p>사진을 업로드해주세요</p>
            </div>
          )}
          <input
            type="file"
            id="imageInput"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <h2 className="section-title">차량 정보</h2>
        <div className="myCarInfo">
          {[
            { label: "차명", field: "vehicle_name" },
            { label: "연식", field: "year" },
            { label: "주행거리", field: "mileage" },
            { label: "차량번호", field: "license_plate" },
            {
              label: "최초등록일",
              field: "first_registration_date",
              type: "date",
            },
          ].map(({ label, field, type = "text" }) => (
            <div className="myCarRow" key={field}>
              <div className="myCarLabel">{label}</div>
              <div className="myCarValue">
                <input
                  type={type}
                  placeholder="입력해주세요"
                  value={carInfo[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  style={{
                    borderBottom: editStates[field]
                      ? "2px solid black"
                      : "none",
                    color: editStates[field] ? "black" : "#c1c1c1",
                  }}
                  readOnly={!editStates[field]}
                />
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(field)}
                >
                  &#9998;
                </button>
              </div>
            </div>
          ))}
          <div className="myCarRow">
            <div className="myCarLabel">연료</div>
            <div className="myCarValue">
              <select
                disabled={!editStates.fuel_type}
                value={carInfo.fuel_type}
                onChange={(e) => handleChange("fuel_type", e.target.value)}
                style={{
                  borderBottom: editStates.fuel_type
                    ? "2px solid black"
                    : "none",
                  color: editStates.fuel_type ? "black" : "#c1c1c1",
                }}
              >
                <option value="">선택해주세요</option>
                <option value="휘발유">휘발유</option>
                <option value="경유">경유</option>
                <option value="LPG">LPG</option>
                <option value="전기">전기</option>
                <option value="가솔린">가솔린</option>
                <option value="하이브리드">하이브리드</option>
              </select>
              <button
                className="edit-button"
                onClick={() => handleEditClick("fuel_type")}
              >
                &#9998;
              </button>
            </div>
          </div>
        </div>
        <h2 className="section-title">보험 정보</h2>
        <div className="insurance-info">
          {[
            { label: "보험사", field: "insurance_company" },
            { label: "보험료", field: "insurance_fee" },
          ].map(({ label, field, type = "text" }) => (
            <div className="myCarRow" key={field}>
              <div className="myCarLabel">{label}</div>
              <div className="myCarValue">
                <input
                  type={type}
                  placeholder="입력해주세요"
                  value={carInfo[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  style={{
                    borderBottom: editStates[field]
                      ? "2px solid black"
                      : "none",
                    color: editStates[field] ? "black" : "#c1c1c1",
                  }}
                  readOnly={!editStates[field]}
                />
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(field)}
                >
                  &#9998;
                </button>
              </div>
            </div>
          ))}
          <div className="myCarRow policyDuration">
            <div className="myCarLabel">보험기간</div>
            <div className="myCarValue">
              <input
                type="date"
                placeholder="입력해주세요"
                value={carInfo.insurance_period_start}
                onChange={(e) =>
                  handleChange("insurance_period_start", e.target.value)
                }
                style={{
                  borderBottom: editStates.insurance_period
                    ? "2px solid black"
                    : "none",
                  color: editStates.insurance_period ? "black" : "#c1c1c1",
                }}
                readOnly={!editStates.insurance_period}
              />
              <span className="date-separator">~ </span>
              <input
                type="date"
                placeholder="입력해주세요"
                value={carInfo.insurance_period_end}
                onChange={(e) =>
                  handleChange("insurance_period_end", e.target.value)
                }
                style={{
                  borderBottom: editStates.insurance_period
                    ? "2px solid black"
                    : "none",
                  color: editStates.insurance_period ? "black" : "#c1c1c1",
                }}
                readOnly={!editStates.insurance_period}
              />
              <button
                className="edit-button"
                onClick={() => handleEditClick("insurance_period")}
              >
                &#9998;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCar;
