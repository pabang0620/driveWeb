import React from "react";
import { useNavigate } from "react-router-dom";

function IncomeTaxComponent({ title, description, icon, route }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(route);
  };

  return (
    <div className="income_container">
      <div className="card">
        <div className="icon">{icon}</div>
        <div className="content">
          <h3 className="title">{title}</h3>
          <p className="description">{description}</p>
          <button className="button" onClick={handleButtonClick}>
            서비스 자세히보기
          </button>
        </div>
      </div>

      <style jsx>{`
        .income_container {
          font-family: Arial, sans-serif;
          margin: 10px;
          flex: 1;

          .card {
            display: flex;
            align-items: center;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            background-color: #f9f9f9;
            justify-content: space-around;
            @media (max-width: 768px) {
            }
          }
          .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          }
          .icon {
            font-size: 58px;
            margin: -10p 6px 0 20px;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            @media (max-width: 768px) {
              font-size: 40px;
              width: 45px;
              height: 45px;
              background-color: transparent;
            }
          }
          .content {
            width: 60%;
            @media (max-width: 768px) {
              width: 70%;
            }
          }
          .title {
            font-size: 20px;
            font-weight: bold;
            margin: 0 0 8px 0;
            color: #333;
            @media (max-width: 768px) {
              font-size: 16px;
              margin: 0 0 5px 0;
            }
          }
          .description {
            width: 90%;
            font-size: 16px;
            color: #555;
            margin: 0 0 15px 0;
            line-height: 1.4;
            @media (max-width: 768px) {
              font-size: 14px;
              width: 100%;
              margin: 0 0 5px 0;
            }
          }
          .button {
            padding: 8px 28px;
            font-size: 14px;
            color: #fff;
            background-color: #3c5997;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            @media (max-width: 768px) {
              font-size: 12px;
            }
          }
          .button:hover {
            background-color: #486bb5;
          }
        }
      `}</style>
    </div>
  );
}

export default IncomeTaxComponent;
