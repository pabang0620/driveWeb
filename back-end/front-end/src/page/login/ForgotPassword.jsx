import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import securityQuestions from "../../components/securityQuestions";
import ResetPasswordModal from "./ResetPasswordModal"; // 모달 컴포넌트 가져오기

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
      <style jsx>{`
        .forgotpassword-container {
          padding: 80px 0 150px 0;

          .forgotpassword-box {
            max-width: 350px;
            width: 70%;
            margin: auto;
            background-color: white;

            @media (max-width: 768px) {
              width: 85%;
              height: calc(100vh - 80px);
            }
          }
          button.goBack {
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            width: 45px;
            height: 45px;
            text-align: left;
            position: relative;
            img {
              width: 30%;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
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
            ul {
              margin-left: 15px;
              margin-top: 5px;
              margin-bottom: 20px;
              li {
                list-style: disc;
                color: #555;
                font-size: 14px;
                line-height: 20px;
                @media (max-width: 768px) {
                  font-size: 12px;
                }
              }
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
          .error {
            margin-top: 5px;
            font-size: 11px;
            color: rgb(255, 80, 0);
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
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;
