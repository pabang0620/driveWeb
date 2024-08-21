import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const NoticeZone = ({ boardsWithPosts }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { permission } = decodedToken;

        // permission 값이 1, 2, 3, 4, 5 중 하나인지 확인
        if ([1, 2, 3, 4, 5].includes(permission)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    vertical: true, // 세로 방향 슬라이드 설정
    arrows: false, // 버튼 제거
  };

  const handleNoticeClick = (id) => {
    if (isAuthorized) {
      navigate(`/board/post/${id}`);
    } else {
      alert("로그인 해주세요.");
    }
  };

  return (
    <div className="noticeZone">
      <Slider {...settings}>
        {boardsWithPosts[1]?.posts.map((post, index) => (
          <div
            key={index}
            className="notice"
            onClick={() => handleNoticeClick(post.id)}
          >
            <h3>{post.title}</h3>
            <p>{post.createdAt.split("T")[0]}</p>
          </div>
        ))}
      </Slider>
      <style jsx>{`
        .noticeZone {
          width: 100%;
          padding: 5px 10px 7px 10px;
          background-color: #f0f3f5;
          border-radius: 10px;
          .notice {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            h3 {
              font-size: 14px;
              font-weight: normal;
              display: inline-block;
              color: #4c4c4c;
              width: 50%;
            }
            p {
              font-size: 13px;
              text-align: right;
              width: 50%;
              display: inline-block;
              color: #4c4c4c;
            }
          }
        }
      `}</style>
    </div>
  );
};
export default NoticeZone;
