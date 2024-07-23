import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SignupEmail() {
  const [username, setUsername] = useState(""); // 이메일 상태
  const [nickname, setNickname] = useState(""); // 닉네임 상태

  const [agreeAll, setAgreeAll] = useState(false); //모두동의
  const [agreePrivacy, setAgreePrivacy] = useState(false); //개인정보수집이용동의
  const [agreeTerms, setAgreeTerms] = useState(false); //이용약관동의

  const navigate = useNavigate(); // React Router의 navigate 함수 사용

  // 이메일 유효성 검사 함수
  const isValidEmail = (username) => {
    return /\S+@\S+\.\S+/.test(username);
  };

  // 전체 동의 체크
  const handleAgreeAll = () => {
    setAgreeAll(!agreePrivacy);
    setAgreePrivacy(!agreePrivacy);
    setAgreeTerms(!agreePrivacy);
  };

  // 개인정보 수집/이용 동의 체크
  const handleAgreePrivacy = () => {
    setAgreePrivacy(!agreePrivacy);
  };

  // 이용약관 동의 체크
  const handleAgreeTerms = () => {
    setAgreeTerms(!agreeTerms);
  };

  // 모든 입력값과 동의 상태 체크 함수
  const canProceed = () => {
    return isValidEmail(username) && nickname !== "" && agreeAll;
  };

  // 다음 버튼 클릭 시 처리 함수
  const handleNext = () => {
    if (canProceed()) {
      // 모든 조건이 충족되면 다음 페이지로 이동
      navigate("/signup/password", {
        state: { username: username, nickname: nickname },
      });
    } else if (!isValidEmail(username)) {
      alert("이메일 형식으로 입력해주세요. ex)abc@abc.com");
    } else if (!agreeAll) {
      alert("약관에 동의해주세요");
    }
  };

  // agreePrivacy 또는 agreeTerms가 변경될 때마다 실행
  useEffect(() => {
    if (agreePrivacy && agreeTerms) {
      setAgreeAll(true); // 개인정보 수집/이용 동의와 이용약관 동의가 모두 체크되면 필수 약관에 전체 동의 체크
    } else {
      setAgreeAll(false); // 하나라도 체크가 해제되면 필수 약관에 전체 동의 해제
    }
  }, [agreePrivacy, agreeTerms]);

  return (
    <div className="container signup-container">
      <div className="signup-box">
        <button className="goBack" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h3>이메일로 시작하기</h3>
        <p>로그인 시 아이디로 사용할 이메일을 입력해주세요.</p>
        <div className="input-container">
          <label htmlFor="username">이메일</label>
          <input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이메일을 입력해주세요."
          />
        </div>
        <div className="input-container">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="nickname"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요."
          />
        </div>
        <div className="terms">
          <p className="agreeAll">
            <input
              type="checkbox"
              id="agreeAll"
              checked={agreeAll}
              onChange={handleAgreeAll}
            />
            <label htmlFor="agreeAll">필수 약관에 전체 동의</label>
          </p>
          <p className="agreePrivacy">
            <input
              type="checkbox"
              id="agreePrivacy"
              checked={agreePrivacy}
              onChange={handleAgreePrivacy}
              disabled={agreeAll}
            />
            <label htmlFor="agreePrivacy">
              <Link to="/terms/privacy_policy" target="_blank">
                개인정보 수집/이용 동의
              </Link>
            </label>
          </p>
          <p className="agreeTerms">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={handleAgreeTerms}
              disabled={agreeAll}
            />
            <label htmlFor="agreeTerms">
              <Link to="/terms/general" target="_blank">
                이용약관 동의
              </Link>
            </label>
          </p>
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
          p {
            font-size: 14px;
            margin-bottom: 30px;
          }
          .input-container {
            margin-bottom: 15px;
            text-align: left;
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
          .terms {
            margin-top: 100px;
            p:not(:nth-of-type(1)) {
              font-size: 14px;
              padding: 0;
              margin-bottom: 10px;
            }
            .agreeAll {
              font-size: 16px;
              font-weight: bold;
              border-bottom: 1px solid #d9d9d9;
              padding: 20px 0;
            }
            label {
              margin-left: 10px;
            }
            input {
              cursor: pointer;
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
          .smallText {
            font-size: 12px;
            text-align: right;
            padding: 10px 0;
            a {
              color: rgb(132 141 148);
              font-weight: bold;
            }
          }
        }
      `}</style>
    </div>
  );
}

export default SignupEmail;
