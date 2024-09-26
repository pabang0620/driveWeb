import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import securityQuestions from "../../components/securityQuestions";
import axios from "axios";
import "./login.scss";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [securityQuestion, setSecurityQuestion] = useState(""); // 보안 질문 상태
  const [securityAnswer, setSecurityAnswer] = useState(""); //보안 질문의 답변 상태

  const [isMatch, setIsMatch] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { username } = location.state || {}; // `username`은 이전 페이지에서 전달됨

  const handleNext = async () => {
    // 비밀번호 유효성 검사
    if (password.length < 4) {
      setError("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordCheck) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (
      !securityQuestion ||
      securityQuestion === "보안 질문을 선택하세요" ||
      securityQuestion.length < 1
    ) {
      alert("보안 질문을 선택해주세요.");
      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(securityAnswer)) {
      alert("보안 질문 답변에는 숫자와 텍스트만 입력할 수 있습니다.");
      return;
    }
    if (securityAnswer.length < 2) {
      alert("보안 질문 답변에는 2자 이상 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("/api/user/resetpassword", {
        password,
        securityQuestion,
        securityAnswer,
      });

      // 서버 응답 처리
      const { data } = response;
      if (data.success) {
        navigate("/login"); // 비밀번호 재설정 성공 후 로그인 페이지로 이동
      } else {
        setError(data.message || "비밀번호 재설정 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("비밀번호 재설정 중 오류 발생:", error);
      setError("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    setIsMatch(password === passwordCheck && passwordCheck.length > 0);
  }, [password, passwordCheck]);

  return (
    <div className="container resetpassword-container">
      <div className="resetpassword-box">
        <h3>비밀번호 재설정</h3>
        <p>새 비밀번호를 입력하고 확인하세요.</p>

        <div className="input-container">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
            onChange={(e) => setPassword(e.target.value)}
          />
          <ul>
            <li>4자 이상</li>
          </ul>
        </div>
        <div className="input-container">
          <label htmlFor="passwordCheck">비밀번호 확인</label>
          <input
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            placeholder="비밀번호를 입력해주세요."
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          {isSubmitted && !isMatch && (
            <p className="error">*비밀번호가 일치하지 않습니다.</p>
          )}
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
          다음
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
