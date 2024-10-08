import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";

function ResetPasswordModal({ username, onClose }) {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.put("/api/user/resetpassword", {
        username,
        newPassword,
      });

      const { data } = response;

      if (data.success) {
        alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인 해주세요.");
        navigate("/login");
      } else {
        setError(data.message || "비밀번호 재설정에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 재설정 중 오류 발생:", error);
      setError("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modalChage">
      <div className="modal-content">
        <h3>비밀번호 재설정</h3>
        <p>새로운 비밀번호를 입력하고 확인하세요.</p>

        <div className="input-container">
          <label>새 비밀번호:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label>비밀번호 확인:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="navyBox" onClick={handleResetPassword}>
          비밀번호 재설정
        </button>
        <button className="close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
