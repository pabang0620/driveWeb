import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import securityQuestions from "../../components/securityQuestions"; // 보안 질문 목록 가져오기
import "./login.scss";

function FindUsername() {
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [securityQuestion, setSecurityQuestion] = useState(""); // 보안 질문 상태
  const [securityAnswer, setSecurityAnswer] = useState(""); // 보안 답변 상태
  const [foundUsername, setFoundUsername] = useState(null); // 찾은 아이디 상태
  const navigate = useNavigate();

  const handleFindUsername = async () => {
    try {
      const response = await axios.post("/api/user/findusername", {
        nickname,
        securityQuestion,
        securityAnswer,
      });

      const { data } = response;

      if (data.success) {
        setFoundUsername(data.username); // 아이디를 상태에 저장
      } else {
        alert(data.message || "아이디 찾기 실패. 정보를 확인해주세요.");
      }
    } catch (error) {
      console.error("아이디 찾기 중 오류 발생:", error);
      alert("아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container findusername-container">
      <div className="findusername-box">
        <h3>아이디 찾기</h3>
        <p>회원가입 시 설정한 닉네임과 보안 질문의 답변을 입력하세요.</p>

        <div className="input-container">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
        </div>
        <div className="input-container security">
          <label>보안 질문:</label>
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
        <button className="navyBox" onClick={handleFindUsername}>
          아이디 찾기
        </button>

        {foundUsername && (
          <div className="found-username">
            <p>
              회원님의 아이디는: <strong>{foundUsername}</strong>입니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindUsername;
