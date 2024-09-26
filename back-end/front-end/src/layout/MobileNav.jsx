import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./layout.scss";

const MobileNav = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY + windowHeight;

      // 스크롤이 페이지 맨 아래에 도달하면 Nav 숨기기
      if (scrollPosition >= documentHeight) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`MobileNavbar ${isVisible ? "" : "hidden"}`}>
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

      {/* <style jsx>{`
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

          .MobileNavbar.hidden {
            display: none;
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
      `}</style> */}
    </div>
  );
};

export default MobileNav;
