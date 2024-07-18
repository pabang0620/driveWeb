import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SignupPassword() {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isMatch, setIsMatch] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // React Router의 navigate 함수 사용

  // 다음 버튼 클릭 시 처리 함수
  const handleNext = () => {
    console.log("d", location.state, password);
    if (location.state && password === passwordCheck && password.length >= 4) {
      alert("비밀번호 일치");
      // 모든 조건이 충족되면 다음 페이지로 이동
      navigate("/signup/job", {
        state: { ...location.state, password: password },
      });
    } else if (password.length < 4) {
      alert("4자 이상 입력해 주세요.");
    } else {
      alert("비밀번호가 일치하지 않아요.");
    }
  };

  useEffect(() => {
    setIsMatch(password === passwordCheck && passwordCheck.length > 0);
  }, [password, passwordCheck]);

  return (
    <div className="container signup-container">
      <div className="signup-box">
        <button className="goBack" onClick={() => navigate(-1)}>
          &lt;
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
        <button className="navyBox" onClick={handleNext}>
          다음
        </button>
      </div>

      <style jsx>{`
        .signup-container {
          padding: 30px 0;
          .signup-box {
            max-width: 350px;
            width: 70%;
            margin: 0 auto;
            background-color: white;
          }
          button.goBack {
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            width: 45px;
            height: 45px;
            text-align: left;
          }
          h3 {
            font-size: 24px;
            margin: 50px 0;
          }
          .input-container {
            margin-bottom: 15px;
            text-align: left;
            ul {
              margin-left: 15px;
              margin-top: 5px;
              margin-bottom: 50px;
              li {
                list-style: disc;
                color: #555;
                font-size: 14px;
                line-height: 20px;
              }
            }
            label {
              display: block;

              color: rgb(156, 165, 173);
              font-size: 12px;
            }
            input {
              width: 95%;
              padding: 10px 0;
              border: none;
              border-bottom: 1px solid #d0d7de;
              font-size: 16px;
              color: rgb(156, 165, 173);
            }
            input:focus {
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
