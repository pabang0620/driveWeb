import React from "react";
import { useNavigate } from "react-router-dom";
import "./mypage.scss";

function IncomeTaxComponent({ title, description, icon, route, isBlurred }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(route);
  };

  return (
    <div className={`income_container ${isBlurred ? "blurred" : ""}`}>
      <div className="card">
        <div className="icon">{icon}</div>
        <div className="content">
          <h3 className="title">{title}</h3>
          <p className="description">{description}</p>
          {!isBlurred && (
            <button className="button" onClick={handleButtonClick}>
              서비스 자세히보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default IncomeTaxComponent;
