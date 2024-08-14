// SignupPage.jsx
import React from "react";
import { Link } from "react-router-dom";

function Signup() {
<<<<<<< HEAD
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

=======
>>>>>>> 00f469d31a0ff91294adfd9fa0e9af19d0f5108f
  return (
    <div className="container signup-container">
      <div className="signup-box">
<<<<<<< HEAD
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
=======
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
>>>>>>> 00f469d31a0ff91294adfd9fa0e9af19d0f5108f
      </div>

      <style jsx>{`
        .signup-container {
          background-color: rgb(244, 244, 244);
          padding: 100px 0;
          .signup-box {
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

export default Signup;
