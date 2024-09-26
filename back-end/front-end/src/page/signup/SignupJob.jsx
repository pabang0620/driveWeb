import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./signup.scss";

const SignupJob = () => {
  const location = useLocation();
  const navigate = useNavigate(); // React Router의 navigate 함수 사용

  // 초기 상태 설정
  const [jobtype, setJobtype] = useState(null);

  // 직종 선택 핸들러
  const handleJobSelection = (job) => {
    setJobtype(job);
  };

  const handleSignup = async () => {
    console.log("d", {
      ...location.state,
      jobType: jobtype,
    });
    try {
      const response = await axios.post("/api/user/register", {
        ...location.state,
        jobtype: jobtype,
      });

      const { token, nickname } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("nickname", nickname);
      alert("회원가입이 완료되었습니다.");
      navigate("/");
      //로그인 성공 후, 토큰 등을 저장하거나 리다이렉트하는 로직 추가
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container signup-container">
      <div className="signup-box">
        <button className="goBack" onClick={() => navigate(-1)}>
          <img
            src={`${process.env.PUBLIC_URL}/images/prevBtn.png`}
            alt="이전"
          />
        </button>
        <h3>직종선택</h3>
        <p>현재 종사하고 있는 직종 하나를 선택해주세요.</p>
        <div className="jobBox">
          <button
            className={jobtype === 1 ? "selected" : ""}
            onClick={() => handleJobSelection(1)}
          >
            택시
          </button>
          <button
            className={jobtype === 2 ? "selected" : ""}
            onClick={() => handleJobSelection(2)}
          >
            배달
          </button>
          <button
            className={jobtype === 3 ? "selected" : ""}
            onClick={() => handleJobSelection(3)}
          >
            기타
          </button>
        </div>
        <button className="navyBox" onClick={handleSignup}>
          다음
        </button>
      </div>
    </div>
  );
};
export default SignupJob;
