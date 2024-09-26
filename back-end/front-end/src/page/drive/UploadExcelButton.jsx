import React, { useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./drive.scss";

const UploadExcelButton = () => {
  const { userId } = useParams(); // useParams를 사용하여 userId를 가져옴

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // 파일 선택 시 상태 업데이트
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // 파일이 선택되면 확인 창 띄우기
      const confirmUpload = window.confirm("데이터를 추가하시겠습니까?");
      if (confirmUpload) {
        handleUpload(selectedFile); // 선택된 파일을 넘겨서 업로드 진행
      } else {
        // "아니오"를 누르면 파일 초기화
        setFile(null);
      }
    } else {
      alert("파일을 선택해주세요.");
    }
  };

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) {
      alert("파일을 선택해주세요.");
      return;
    }

    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", selectedFile);

    if (userId) {
      formData.append("userId", userId);
    }

    try {
      const response = await axios.post("/api/excel/upload-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  // 파일 선택 창을 열기 위한 함수
  const triggerFileInput = () => {
    fileInputRef.current.click(); // 숨겨진 input[type="file"] 클릭 트리거
  };

  return (
    <div className="uploadbtnRelate">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }} // input 요소 숨기기
        onChange={handleFileChange}
      />
      <button className="uploadbtn" onClick={triggerFileInput}>
        Excel 파일 업로드
      </button>
    </div>
  );
};

export default UploadExcelButton;
