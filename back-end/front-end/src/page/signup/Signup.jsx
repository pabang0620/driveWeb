// SignupPage.jsx
import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("/api/user/register", {
        nickname,
        username,
        password,
      });
      console.log("Signup successful:", response.data);
      // 회원가입 성공 후, 리다이렉트하는 로직 추가
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <div className="input-container">
          <label htmlFor="nickname">닉네임:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="username">ID:</label>
          <input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button onClick={handleSignup}>Sign Up</button>
      </div>

      <style jsx>{`
        .signup-container {
          width: 20%;
          position: absolute;
          left: 40%;
          top: 25%;
        }
        .signup-box {
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

export default Signup;
