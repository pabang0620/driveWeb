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
    });

    naverLogin.init();

    // '네이버 아이디로 로그인' 버튼을 클릭할 때 로그인을 진행
    const loginTrigger = document.getElementById("naverIdLogin");
    loginTrigger.onclick = () => naverLogin.authorize();

    naverLogin.getLoginStatus(async function (status) {
      if (status) {
        const token = naverLogin.accessToken.accessToken;
        const userInfo = naverLogin.user;

        console.log("Naver Login Success");
        console.log("Access Token:", token);
        console.log("User Info:", userInfo);

        try {
          const response = await axios.post("/api/user/naver-login", {
            token,
          });
          localStorage.setItem("token", response.data);
          navigate("/"); // 로그인 후 리다이렉트할 경로
        } catch (error) {
          console.error(
            "Naver login error:",
            error.response?.data || error.message
          );
        }
      }
    });
  }, [navigate]);

  return (
    <div
      id="naverIdLogin"
      className="naverIdLogin"
      style={{ cursor: "pointer" }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/images/login_icons/naver_login.png`}
        alt="네이버 아이디로 로그인"
      />
    </div>
  );
}

export default NaverLogin;
