import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import securityQuestions from "../../components/securityQuestions";
function SignupPassword() {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [securityQuestion, setSecurityQuestion] = useState(""); // 보안 질문 상태
  const [securityAnswer, setSecurityAnswer] = useState(""); //보안 질문의 답변 상태

  const [isMatch, setIsMatch] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // React Router의 navigate 함수 사용

  // 다음 버튼 클릭 시 처리 함수
  const handleNext = () => {
    if (password.length < 4) {
      alert("4자 이상 입력해 주세요.");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
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

    if (!/^[a-zA-Z0-9\s가-힣]+$/.test(securityAnswer)) {
      alert("보안 질문 답변에는 숫자와 텍스트만 입력할 수 있습니다.");
      return;
    }
    if (securityAnswer.length < 2) {
      alert("보안 질문 답변에는 2자 이상 입력해주세요.");
      return;
    }
    // 모든 조건이 충족된 경우
    navigate("/signup/job", {
      state: {
        ...location.state,
        password: password,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
      },
    });
  };

  useEffect(() => {
    setIsMatch(password === passwordCheck && passwordCheck.length > 0);
  }, [password, passwordCheck]);

  return (
    <div className="container signup-container">
      <div className="signup-box">
        <button className="goBack" onClick={() => navigate(-1)}>
          <img src="/images/prevBtn.png" alt="이전" />
        </button>
        <h3>비밀번호 설정</h3>
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

      <style jsx>{`
        .signup-container {
          padding: 80px 0 150px 0;

          .signup-box {
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
            a {
              color: white;
              display: inline-block;
              width: 100%;
              height: 100%;
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

export default SignupPassword;
