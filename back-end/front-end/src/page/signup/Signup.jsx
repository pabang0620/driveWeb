// SignupPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./signup.scss";

function Signup() {
  return (
    <div className="container signup-container">
      <div className="signup-box">
        <h2>
          <img
            src={`${process.env.PUBLIC_URL}/images/mainlogo_1.png`}
            alt=""
            x
          />
        </h2>
        <h3>운행일지 회원가입</h3>
        <button className="navyBox">
          <Link to="/signup/email">시작하기</Link>
        </button>
        <p className="smallText">
          <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
