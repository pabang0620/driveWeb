import React, { useEffect, useState } from "react";
import axios from "axios"; // axios를 직접 임포트
import Modal from "./Modal";
import { DynamicInput } from "../../components/InputBox";
import { postDrive } from "../../components/ApiPost";
import "./drive.scss";

const DriveWrite = ({
  number,
  setNumber,
  showModal,
  toggleModal,
  closeModal,
  drivingLogId,
}) => {
  const [driveData, setDriveData] = useState({
    date: "",
    memo: "",
    start_time: "",
    end_time: "",
    cumulative_km: 0,
    business_distance: 0,
    fuel_amount: 0,
    total_driving_cases: 0,
  });
  const token = localStorage.getItem("token");
  const needed = 1;
  useEffect(() => {
    setNumber(1);
    const driveId = localStorage.getItem("drivingLogId");
    const drivingLogIdCheck =
      drivingLogId == undefined ? driveId : drivingLogId;
    const fetchDriveData = async () => {
      if (drivingLogIdCheck) {
        try {
          const response = await axios.get(
            `/api/drive/detail/${drivingLogIdCheck}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
              },
            }
          );

          const data = response.data;
          setDriveData({
            date: data.date || "",
            memo: data.memo || "",
            start_time: data.driving_records[0]?.start_time || "",
            end_time: data.driving_records[0]?.end_time || "",
            cumulative_km: data.driving_records[0]?.cumulative_km || 0,
            business_distance: data.driving_records[0]?.business_distance || 0,
            fuel_amount: data.driving_records[0]?.fuel_amount || 0,
            total_driving_cases:
              data.driving_records[0]?.total_driving_cases || 0,
          });
        } catch (error) {
          console.error("Error fetching driving log data:", error);
          alert("데이터를 가져오는 중 오류가 발생했습니다.");
        }
      }
    };
    fetchDriveData(); // 비동기 함수 호출
  }, [drivingLogId, token]); // token이 변경될 때도 effect가 실행되도록 설정

  const handleNext = async () => {
    console.log(drivingLogId);
    const driveId = localStorage.getItem("drivingLogId");
    const drivingLogIdCheck =
      drivingLogId == undefined ? driveId : drivingLogId;
    if (validateForm()) {
      try {
        let response;
        if (drivingLogIdCheck) {
          // drivingLogId가 있을 경우 PUT 요청 (수정)
          response = await axios.put(
            `/api/drive/detail/${drivingLogIdCheck}`,
            driveData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          // drivingLogId가 없을 경우 POST 요청 (새로운 데이터 생성)
          response = await postDrive(driveData, token);
        }

        if (response.error) {
          alert("누적 거리를 확인해주세요.");
          return;
        }

        if (response.data && response.data.driving_log_id !== undefined) {
          // 생성할 때 응답 처리
          localStorage.setItem("drivingLogId", response.data.driving_log_id);
        } else if (response.driving_log_id !== undefined) {
          // 수정할 때 응답 처리
          localStorage.setItem("drivingLogId", response.driving_log_id);
        }
        localStorage.setItem(
          "working_hours_seconds",
          response.working_hours_seconds
        );
        localStorage.setItem("businessDistance", driveData.business_distance);
        closeModal(false); // 모달 닫기
        setNumber(2);
        toggleModal(); // 다음 모달 열기
      } catch (error) {
        console.error("Error saving drive data:", error);
        alert(
          "누적 거리를 확인해주세요. (차량 정보에 기입된 누적거리보다 커야합니다.)"
        );
      }
    }
  };

  const handleInputChange = (field, value) => {
    // 누적거리나 영업거리 필드가 아닌 경우에만 상태 업데이트
    if (field === "cumulative_km" || field === "business_distance") {
      // drivingLogId가 없을 때만 수정 가능하도록 설정
      if (!drivingLogId) {
        setDriveData((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      }
    } else {
      setDriveData((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = {
      date: "운행날짜",
      start_time: "시작시간",
      end_time: "종료시간",
      cumulative_km: "누적거리",
      // business_distance: "영업거리",
      // fuel_amount: "주유량",
      // total_driving_cases: "총 운행 수",
    };

    for (let field in requiredFields) {
      if (!driveData[field]) {
        alert(`항목을 입력해주세요: ${requiredFields[field]}`);
        return false;
      }
    }
    return true;
  };

  return (
    <Modal
      closeModal={closeModal}
      showModal={showModal}
      toggleModal={toggleModal}
      number={number}
      title={"운행일지"}
      content={
        <div className="drive">
          <DynamicInput
            labelName="운행날짜"
            inputType="date"
            value={driveData.date}
            fieldName="date"
            onChange={handleInputChange}
            needed={needed}
          />
          <DynamicInput
            labelName="시작시간"
            inputType="time"
            value={driveData.start_time}
            fieldName="start_time"
            onChange={handleInputChange}
            needed={needed}
          />
          <DynamicInput
            labelName="종료시간"
            inputType="time"
            value={driveData.end_time}
            fieldName="end_time"
            onChange={handleInputChange}
            needed={needed}
          />
          <DynamicInput
            labelName="누적거리(km)"
            inputType="number"
            value={driveData.cumulative_km}
            fieldName="cumulative_km"
            onChange={handleInputChange}
            needed={needed}
          />
          <DynamicInput
            labelName="영업거리(km)"
            inputType="number"
            value={driveData.business_distance}
            fieldName="business_distance"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="주유량(L)"
            inputType="number"
            value={driveData.fuel_amount}
            fieldName="fuel_amount"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="총 운행 수(건)"
            inputType="number"
            value={driveData.total_driving_cases}
            fieldName="total_driving_cases"
            onChange={handleInputChange}
          />
          <DynamicInput
            labelName="메모"
            inputType="text"
            value={driveData.memo}
            fieldName="memo"
            onChange={handleInputChange}
          />
          <div
            style={{
              fontSize: "16px",
              color: "#555",
              fontWeight: "500",
              margin: "10px 0",
              textAlign: "center",
            }}
          >
            누적거리(km) , 영업거리(km)는 수정이 불가능합니다. 한번 더
            확인해주세요.
          </div>
          <button onClick={handleNext}>다음</button>
        </div>
      }
    />
  );
};

export default DriveWrite;
