import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./admin.scss";

const PremiumButton = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [canRender, setCanRender] = useState(false); // 렌더링 여부 상태 추가

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.permission === 5) {
          setCanRender(true); // permission이 5인 경우 렌더링 허용
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleClick = () => {
    navigate("/payment"); // '/payment' 경로로 이동
  };

  if (!canRender) {
    return null; // permission이 5가 아닌 경우 렌더링하지 않음
  }

  return (
    <div
      className="premium-button-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button className="premium-button" onClick={handleClick}>
        ?
      </button>
      <div className="tooltip">블러 제거하기</div>
    </div>
  );
};

export default PremiumButton;
