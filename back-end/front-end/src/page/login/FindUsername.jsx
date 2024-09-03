import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import securityQuestions from "../../components/securityQuestions"; // 보안 질문 목록 가져오기

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

      <style jsx>{`
        .findusername-container {
          padding: 80px 0 150px 0;
          ul,
          li,
          ol {
            list-style: none;
          }
          .findusername-box {
            max-width: 350px;
            width: 70%;
            margin: auto;
            background-color: white;

            @media (max-width: 768px) {
              width: 85%;
              height: calc(100vh - 80px);
            }
          }
          h3 {
            font-size: 24px;
            margin: 50px 0;
            @media (max-width: 768px) {
              font-size: 20px;
              margin: 30px 0;
            }
          }
          p {
            font-size: 14px;
            margin-bottom: 30px;
            @media (max-width: 768px) {
              font-size: 12px;
              white-space: nowrap;
              margin: 15px 0;
            }
          }
          .input-container {
            margin-bottom: 15px;
            text-align: left;

            &.security {
              margin-top: 15%;
            }

            label {
              display: block;
              color: rgb(156, 165, 173);
              font-size: 12px;
              @media (max-width: 768px) {
                font-size: 12px;
              }
            }

            input {
              width: 95%;
              padding: 10px 0 10px 5px;
              border: none;
              border-bottom: 1px solid #d0d7de;
              font-size: 16px;
              color: rgb(156, 165, 173);
              @media (max-width: 768px) {
                font-size: 14px;
              }
            }
            input:focus {
              border-color: #222;
              outline: none;
              color: #222;
            }

            select {
              width: 95%;
              margin-top: 10px;
              padding: 10px 0;
              border: none;
              border-bottom: 1px solid #d0d7de;
              font-size: 16px;
              color: rgb(156, 165, 173);
              @media (max-width: 768px) {
                font-size: 14px;
              }
            }
            select:focus {
              border-color: #222;
              outline: none;
              color: #222;
            }
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
            margin-top: 30px;
            font-weight: bold;
            @media (max-width: 768px) {
              font-size: 14px;
            }
            &:hover {
              background-color: #7388b6;
            }
          }

          .found-username {
            margin-top: 20px;
            font-size: 14px;
            color: #333;
            text-align: center;
            strong {
              font-weight: bold;
              color: #3c5997;
            }
          }
        }
      `}</style>
    </div>
  );
}

export default FindUsername;
