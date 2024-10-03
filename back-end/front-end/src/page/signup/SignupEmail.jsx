import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.scss";

function SignupEmail() {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [nickname, setNickname] = useState(""); // 닉네임 상태

  const [agreeAll, setAgreeAll] = useState(false); // 모두동의
  const [agreePrivacy, setAgreePrivacy] = useState(false); // 개인정보수집이용동의
  const [agreeTerms, setAgreeTerms] = useState(false); // 이용약관동의

  const navigate = useNavigate(); // React Router의 navigate 함수 사용

  // 이메일 유효성 검사 함수
  const isValidEmail = (email) => {
    // 이메일 형식 검사 (간단한 정규식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 전체 동의 체크
  const handleAgreeAll = () => {
    setAgreeAll(!agreeAll);
    setAgreePrivacy(!agreeAll);
    setAgreeTerms(!agreeAll);
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
    return isValidEmail(email) && nickname !== "" && agreeAll;
  };

  // 다음 버튼 클릭 시 처리 함수
  const handleNext = () => {
    // 유효성 검사 및 오류 메시지 변수 설정
    let errorMessage = null;

    // 조건 체크
    if (!isValidEmail(email)) {
      errorMessage = "유효한 이메일 주소를 입력해주세요.";
    } else if (nickname === "") {
      errorMessage = "닉네임을 입력해주세요.";
    } else if (!agreeAll) {
      errorMessage = "약관에 동의해주세요.";
    }

    // 오류 메시지가 있을 경우 경고창을 띄우고 함수 종료
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    // 모든 조건이 충족되면 다음 페이지로 이동
    navigate("/signup/password", {
      state: {
        email: email,
        nickname: nickname,
      },
    });
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
    <div className="container signup-containerE">
      <div className="signup-box">
        <button className="goBack" onClick={() => navigate(-1)}>
          <img
            src={`${process.env.PUBLIC_URL}/images/prevBtn.png`}
            alt="이전"
          />
        </button>
        <h3>이메일로 가입하기</h3>
        <p>로그인 시 사용할 이메일 주소를 입력해주세요.</p>
        <div className="input-container">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
          />
          <ul>
            <li>유효한 이메일 형식이어야 합니다.</li>
          </ul>
        </div>
        <div className="input-container">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
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
    </div>
  );
}

export default SignupEmail;
