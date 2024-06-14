// LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/user/login", { email, password });
      console.log("Login successful:", response.data);
      // 로그인 성공 후, 토큰 등을 저장하거나 리다이렉트하는 로직 추가
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <div className="input-container">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>

      <style jsx>{`
        .login-container {
          width: 20%;
          position: absolute;
          left: 40%;
          top: 25%;
        }
        .login-box {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        h2 {
          color: #3c5997;
          margin-bottom: 20px;
          font-size: 24px;
        }
        .input-container {
          margin-bottom: 15px;
          text-align: left;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #3c5997;
          font-weight: bold;
        }
        input {
          width: 95%;
          padding: 10px;
          border: 1px solid #d0d7de;
          border-radius: 5px;
          font-size: 16px;
        }
        input:focus {
          border-color: #05aced;
          outline: none;
        }
        button {
          width: 100%;
          padding: 12px;
          background-color: #3c5997;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #05aced;
        }
      `}</style>
    </div>
  );
}

export default Login;
