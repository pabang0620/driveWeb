import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/user/login", {
        username,
        password,
      });
<<<<<<< HEAD
      console.log("Login successful:", response.data);
      // 로그인 성공 후, 토큰 등을 저장하거나 리다이렉트하는 로직 추가
=======
      // 로그인 성공 후 토큰을 로컬 스토리지에 저장
      localStorage.setItem("token", response.data);

      //홈으로 이동
      navigate("/");
>>>>>>> 00f469d31a0ff91294adfd9fa0e9af19d0f5108f
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container login-container">
      <div className="login-box">
        <h2>
          {" "}
          <img
            src={`${process.env.PUBLIC_URL}/images/mainlogo_1.png`}
            alt=""
          />{" "}
        </h2>
        <div className="input-container">
<<<<<<< HEAD
          <label htmlFor="username">username:</label>
=======
          <label htmlFor="username">이메일</label>
>>>>>>> 00f469d31a0ff91294adfd9fa0e9af19d0f5108f
          <input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
<<<<<<< HEAD
=======
            placeholder="이메일을 입력해주세요."
>>>>>>> 00f469d31a0ff91294adfd9fa0e9af19d0f5108f
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
          />
        </div>
        <button className="navyBox" onClick={handleLogin}>
          로그인
        </button>
        <p className="smallText">
          <Link to="/signup">회원가입</Link>
        </p>
      </div>

      <style jsx>{`
        .login-container {
          background-color: rgb(244, 244, 244);
          padding: 100px 0;
          .login-box {
            max-width: 350px;
            width: 70%;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          h2 {
            img {
              width: 35px;
              height: 35px;
            }
            margin-bottom: 20px;
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

          .smallText {
            font-size: 12px;
            text-align: right;
            padding: 10px 0;
            a {
              color: rgb(132 141 148);
              font-weight: bold;
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

export default Login;
