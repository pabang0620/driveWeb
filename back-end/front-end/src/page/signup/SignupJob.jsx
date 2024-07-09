import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SignupJob = () => {
  const location = useLocation();
  const navigate = useNavigate(); // React Router의 navigate 함수 사용

  // 초기 상태 설정
  const [jobType, setJobType] = useState(null);

  // 직종 선택 핸들러
  const handleJobSelection = (job) => {
    setJobType(job);
  };

  const handleSignup = async () => {
    console.log("d", {
      ...location.state,
      jobType: jobType,
    });
    try {
      const response = await axios.post("/api/user/register", {
        ...location.state,
        jobType: jobType,
      });
      console.log("Signup successful:", response.data);
      //로그인 성공 후, 토큰 등을 저장하거나 리다이렉트하는 로직 추가
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container signup-container">
      <div className="signup-box">
        <button className="goBack" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h3>직종선택</h3>
        <p>현재 종사하고 있는 직종 하나를 선택해주세요.</p>
        <div className="jobBox">
          <button
            className={jobType === 1 ? "selected" : ""}
            onClick={() => handleJobSelection(1)}
          >
            택시
          </button>
          <button
            className={jobType === 2 ? "selected" : ""}
            onClick={() => handleJobSelection(2)}
          >
            배달
          </button>
          <button
            className={jobType === 3 ? "selected" : ""}
            onClick={() => handleJobSelection(3)}
          >
            기타
          </button>
        </div>
        <button className="navyBox" onClick={handleSignup}>
          다음
        </button>
      </div>

      <style jsx>{`
        .signup-container {
          padding: 30px 0 120px 0;
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
          .jobBox {
            margin-bottom: 50px;
            button {
              margin-right: 10px;
              padding: 10px 20px;
              background-color: #ddd;
              border-radius: 5px;
              cursor: pointer;
              &.selected {
                background-color: #05aced;
                color: white;
              }
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
        }
      `}</style>
    </div>
  );
};
export default SignupJob;
