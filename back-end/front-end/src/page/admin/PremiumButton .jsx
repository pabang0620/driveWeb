import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PremiumButton = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    navigate("/payment"); // '/payment' 경로로 이동
  };

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
      <style jsx>{`
        .premium-button-container {
          position: fixed;
          bottom: 100px;
          right: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          flex-direction: column;
          @media (max-width: 768px) {
            bottom: 50px;
            right: 30px;
          }
        }

        .premium-button {
          background-color: #ff5722;
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          font-size: 24px;
          font-weight: bold;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease, transform 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .tooltip {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(-110%, -50%);
          background-color: #333;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 14px;
          white-space: nowrap;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease;
          transition: font-size 0.3s ease, transform 0.3s ease;
        }
        .premium-button-container:hover {
          .premium-button {
            background-color: #e64a19;
            transform: scale(1.1);
          }
          .tooltip {
            background-color: #444; /* 호버 시 배경색 변경 */
            font-size: 16px;
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 호버 시 그림자 강화 */
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* 반응형 디자인 */
        @media (max-width: 600px) {
          .premium-button {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumButton;
