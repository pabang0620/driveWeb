import React from "react";
import { useNavigate } from "react-router-dom";

const MobileNav = () => {
  const navigate = useNavigate();

  return (
    <div className="MobileNavbar">
      <div className="nav-item" onClick={() => navigate("/driving_log")}>
        <img
          src={`${process.env.PUBLIC_URL}/images/driveIcon.png`}
          alt="Driving Log"
        />
      </div>
      <div className="nav-item" onClick={() => navigate("/mypage")}>
        <img
          src={`${process.env.PUBLIC_URL}/images/mypageIcon.png`}
          alt="My Page"
        />
      </div>
      <div className="nav-item" onClick={() => navigate("/ranking")}>
        <img
          src={`${process.env.PUBLIC_URL}/images/rankingIcon.png`}
          alt="Ranking"
        />
      </div>
      <div className="nav-item" onClick={() => navigate("/mycar")}>
        <img
          src={`${process.env.PUBLIC_URL}/images/carIcon.png`}
          alt="My Car"
        />
      </div>

      <style jsx>{`
        .MobileNavbar {
          display: none;
        }

        @media (max-width: 768px) {
          .MobileNavbar {
            display: flex;
            position: fixed;
            bottom: 0;
            width: 100%;
            justify-content: space-around;
            align-items: center;
            background-color: #f8f9fa;
            padding: 10px 0;
            border-top: 1px solid #ddd;
          }
          .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            color: #555;
            img {
              cursor: pointer;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default MobileNav;
