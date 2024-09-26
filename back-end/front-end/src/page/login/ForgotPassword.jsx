import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import securityQuestions from "../../components/securityQuestions";
import ResetPasswordModal from "./ResetPasswordModal"; // 모달 컴포넌트 가져오기
import "./login.scss";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부 상태 추가

  const navigate = useNavigate();

  const handleNext = async () => {
    try {
      const response = await axios.post("/api/user/verifysecurity", {
        username,
        securityQuestion,
        securityAnswer,
      });

      const { data } = response;

      if (data.success) {
        setShowModal(true); // 보안 질문과 답변이 일치하면 모달 표시
      } else {
        alert(data.message || "비밀번호 찾기 실패. 정보를 확인해주세요.");
      }
    } catch (error) {
      console.error("비밀번호 찾기 중 오류 발생:", error);
      alert("아이디를 다시 확인해주세요.");
    }
  };

  return (
    <div className="container forgotpassword-container">
      <div className="forgotpassword-box">
        <h3>비밀번호 찾기</h3>
        <p>
          비밀번호를 재설정하려면, 회원가입 시 설정한 사용자명과 보안 질문의
          답변을 입력하세요.
        </p>

        <div className="input-container">
          <label htmlFor="username">아이디</label>
          <input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력하세요"
          />
          <ul>
            <li>영문과 숫자</li>
            <li>최소 3자</li>
          </ul>
        </div>
        <div className="input-container security">
          <label>보안 질문 (비밀번호 찾기를 위해 필요합니다):</label>
          <select
            value={securityQuestion}
            onChange={(e) => setSecurityQuestion(e.target.value)}
            required
          >
            {securityQuestions.map((question, index) => (
              <option key={index} value={question}>
                {question}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <label>보안 질문 답변:</label>
          <input
            type="text"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
          />
        </div>
        <button className="navyBox" onClick={handleNext}>
          비밀번호 찾기
        </button>

        {showModal && (
          <ResetPasswordModal
            username={username}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
