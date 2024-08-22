import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCheck({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // 토큰을 로컬 스토리지에서 가져옴
    if (!token || isTokenExpired(token)) {
      // 토큰이 없거나 만료된 경우
      alert("세션이 만료되었습니다. 재로그인 해주세요.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
    }
  }, [navigate]);

  // 토큰 만료 체크 함수
  const isTokenExpired = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.exp * 1000 < Date.now(); // 토큰의 만료시간(exp)과 현재 시간을 비교
    } catch (error) {
      return true; // 토큰 파싱 실패 시 만료된 것으로 간주
    }
  };

  return <>{children}</>; // 유효한 경우 자식 컴포넌트 렌더링
}

export default AuthCheck;
