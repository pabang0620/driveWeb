import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        alert("비밀번호가 성공적으로 변경되었습니다.");
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
    <div className="modal">
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
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          width: 400px;
          max-width: 90%;
        }
        .input-container {
          margin-bottom: 15px;
          text-align: left;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
        }
        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }
        .error {
          color: red;
          font-size: 12px;
          margin-top: 10px;
        }
        button.navyBox {
          width: 100%;
          padding: 12px;
          background-color: #3c5997;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
          margin-top: 20px;
          font-weight: bold;
        }
        button.navyBox:hover {
          background-color: #7388b6;
        }
        button.close {
          margin-top: 15px;
          background-color: #e2e2e2;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default ResetPasswordModal;
