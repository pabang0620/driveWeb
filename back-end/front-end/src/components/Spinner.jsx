import React from "react";

const Spinner = () => (
  <div className="spinner">
    <div className="dot1"></div>
    <div className="dot2"></div>
    <div className="dot3"></div>
    <style jsx>{`
      .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .dot1,
      .dot2,
      .dot3 {
        width: 15px;
        height: 15px;
        margin: 5px;
        background-color: #05aced;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
      }
      .dot2 {
        animation-delay: -0.16s;
      }
      .dot3 {
        animation-delay: -0.32s;
      }
      @keyframes bounce {
        0%,
        80%,
        100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    `}</style>
  </div>
);

export default Spinner;
