import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import NaverLogin from "./NaverLogin";
import KakaoLogin from "react-kakao-login";

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
      localStorage.setItem("token", response.data);

      navigate("/");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      // 서버에서 받은 에러 메시지를 alert로 표시
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  /*----------------------구글 로그인 핸들러----------------------*/
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      console.log("Google login success:", credentialResponse);

      const response = await axios.post("/api/social/google-login", {
        token: credentialResponse.credential,
      });

      // 응답 데이터에서 토큰만 추출하여 로컬스토리지에 저장
      const token = response.data.token;
      console.log("JWT Token:", token); // 콘솔에 토큰 값 출력

      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      console.error(
        "Google login error:",
        error.response?.data || error.message
      );
    }
  };

  const handleGoogleLoginFailure = () => {
    console.error("Google login failed");
  };

  /*----------------------네이버 로그인 핸들러----------------------*/
  const handleNaverLoginSuccess = async (accessToken) => {
    try {
      console.log("Extracted access token:", accessToken);

      const responseData = await axios.post("/api/social/naver-login", {
        token: accessToken,
      });

      const token = responseData.data.token;
      console.log("JWT Token:", token);
      localStorage.setItem("token", token);

      navigate("/");
    } catch (error) {
      console.error("Naver login error:", error);

      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert(
          `Error: ${error.response.data.error}\nMessage: ${error.response.data.message}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response received from server. Please try again later.");
      } else {
        console.error("Error setting up the request:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleNaverLoginFailure = (error) => {
    console.error("Naver login failed:", error);
  };

  /*----------------------카카오 로그인 핸들러----------------------*/
  const handleKakaoLoginSuccess = async (response) => {
    try {
      console.log("Kakao login success:", response);

      const responseData = await axios.post("/api/social/kakao-login", {
        token: response.response.access_token,
      });

      // 응답 데이터에서 토큰만 추출하여 localStorage에 저장
      const token = responseData.data.token;
      console.log("JWT Token:", token);

      localStorage.setItem("token", token);
      localStorage.removeItem("kakao_db73a80e65b6fe722d881859aec02bb7");

      // 로그인이 성공하면 홈 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error(
        "Kakao login error:",
        error.response?.data || error.message
      );
    }
  };

  const handleKakaoLoginFailure = (error) => {
    console.error("Kakao login failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="container login-container">
        <div className="login-box">
          <h2>
            <img
              src={`${process.env.PUBLIC_URL}/images/mainlogo_1.png`}
              alt=""
            />
          </h2>
          <div className="input-container">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력해주세요."
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
          <div className="btnBox">
            <button className="navyBox" onClick={handleLogin}>
              로그인
            </button>

            <GoogleLogin
              className="googleLogin"
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
            <NaverLogin
              clientId={process.env.REACT_APP_NAVER_CLIENT_ID}
              callbackUrl={window.location.origin}
              onSuccess={handleNaverLoginSuccess}
              onFailure={handleNaverLoginFailure}
            />

            <KakaoLogin
              className="kakaoLogin"
              token={process.env.REACT_APP_KAKAO_CLIENT_ID} // 여기에 JavaScript 키를 사용해야 합니다.
              onSuccess={handleKakaoLoginSuccess}
              onFailure={handleKakaoLoginFailure}
              getProfile={true}
              redirectUri="https://krdriver.com/oauth" // 등록한 Redirect URI 사용
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/login_icons/kakao_login.png`}
                alt="카카오 아이디로 로그인"
              />
            </KakaoLogin>
          </div>
          <p className="smallText">
            <Link to="/login/forgotpassword">비밀번호를 잊으셨나요?</Link>
            <Link to="/signup">회원가입</Link>
          </p>
        </div>

        <style jsx>{`
          .login-container {
            background-color: rgb(244, 244, 244);
            padding: 100px 0;
            @media (max-width: 768px) {
              padding: 0;
            }
          }
          .login-box {
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
              height: calc(100vh - 80px);
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
              img {
                width: 50px;
                height: 50px;
              }
            }
          }
          .input-container {
            margin-bottom: 15px;
            text-align: left;
            @media (max-width: 768px) {
              width: 85%;
              text-align: center;
            }
            label {
              display: block;
              color: rgb(156, 165, 173);
              font-size: 12px;
              @media (max-width: 768px) {
                font-size: 12px;
              }
            }
            input {
              width: 95%;
              padding: 10px 0;
              border: none;
              border-bottom: 1px solid #d0d7de;
              font-size: 16px;
              color: rgb(156, 165, 173);
              @media (max-width: 768px) {
                font-size: 14px;
              }
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
            @media (max-width: 768px) {
              font-size: 14px;
            }
            a {
              color: rgb(132 141 148);
              font-weight: bold;
              padding: 5px 10px;
              display: block;
            }
          }

          .btnBox {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            > div,
            > button {
              width: 100% !important;
              height: 40px !important;
            }
            @media (max-width: 768px) {
              width: 80%;
              font-size: 16px;
            }
            .kakaoLogin {
              background-color: #fee500 !important;
              position: relative !important;
              img {
                height: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
            .naverIdLogin {
              background-color: #03c75a !important;
              position: relative !important;
              border-radius: 3px;
              img {
                width: auto;
                height: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
            button.navyBox {
              background-color: #3c5997;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              transition: background-color 0.3s;
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
    </GoogleOAuthProvider>
  );
}

export default Login;
