import React from "react";

const ServiceUnavailable = () => {
  return (
    <div className="service-unavailable">
      <h1>서비스 점검 중입니다</h1>
      <p>현재 서비스 점검 중입니다. 잠시 후 다시 시도해주세요.</p>

      <style jsx>{`
        .service-unavailable {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
        }
        h1 {
          font-size: 24px;
          color: #ff0000;
        }
        p {
          font-size: 18px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default ServiceUnavailable;
