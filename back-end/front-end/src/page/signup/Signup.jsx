// SignupPage.jsx
import React from "react";
import { Link } from "react-router-dom";

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

      <style jsx>{`
        .signup-container {
          background-color: rgb(244, 244, 244);
          padding: 100px 0;
          @media (max-width: 768px) {
            padding: 0;
          }
          .signup-box {
            max-width: 350px;
            width: 70%;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            @media (max-width: 768px) {
              width: 100%;
              max-width: 100%;
              height: calc(100vh - 100px);
              border-radius: 0px;
              box-shadow: 0 0 0;
              display: flex;
              flex-wrap: wrap;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
          }
          h2 {
            img {
              width: 35px;
              height: 35px;
            }
            margin-bottom: 20px;
            @media (max-width: 768px) {
              margin-bottom: 0;
            }
          }
          h3 {
            @media (max-width: 768px) {
              font-size: 7vw;
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
              font-size: 5vw;
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
          .smallText {
            font-size: 12px;
            text-align: right;
            padding: 10px 0;
            @media (max-width: 768px) {
              font-size: 4vw;
            }
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

export default Signup;
