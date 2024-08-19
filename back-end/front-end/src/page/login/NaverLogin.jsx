import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NaverLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const { naver } = window;

    const naverLogin = new naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
      callbackUrl: window.location.origin,
      isPopup: false, // 팝업 형태로 로그인 창을 띄울지 여부
      loginButton: { color: "green", type: 3, height: 40 }, // 로그인 버튼 스타일
    });

    naverLogin.init();

    naverLogin.getLoginStatus(async function (status) {
      if (status) {
        // 로그인 성공 시 반환된 토큰 및 사용자 정보를 콘솔에 출력
        const token = naverLogin.accessToken.accessToken;
        const userInfo = naverLogin.user; // 사용자 정보

        console.log("Naver Login Success");
        console.log("Access Token:", token);
        console.log("User Info:", userInfo);

        try {
          const response = await axios.post("/api/user/naver-login", {
            token,
          });
          localStorage.setItem("token", response.data);
          //   navigate("/");
        } catch (error) {
          console.error(
            "Naver login error:",
            error.response?.data || error.message
          );
        }
      }
    });
  }, [navigate]);

  return <div id="naverIdLogin" />;
}

export default NaverLogin;
