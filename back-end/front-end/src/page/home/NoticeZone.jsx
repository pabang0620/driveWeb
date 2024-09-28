import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // 수정: jwtDecode import 방식
import "./home.scss";

const NoticeZone = ({ boardsWithPosts, maintenanceItem }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { permission } = decodedToken;

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
    vertical: true,
    arrows: false,
  };

  const handleNoticeClick = (id) => {
    navigate(`/board/post/${id}`);
  };

  // boardsWithPosts 배열이 존재하는지 확인
  const hasBoardsWithPosts =
    Array.isArray(boardsWithPosts) && boardsWithPosts.length > 0;
  // maintenanceItem이 있을 때 스타일을 적용
  const noticeZoneStyle =
    maintenanceItem && maintenanceItem.length > 0
      ? { width: "70%", margin: "90px auto -30px" }
      : {};

  return (
    <div className="noticeZone" style={noticeZoneStyle}>
      <Slider {...settings}>
        {/* maintenanceItem이 있을 경우 해당 데이터를 렌더링 */}
        {maintenanceItem && maintenanceItem.length > 0 ? (
          maintenanceItem.map((item, index) => (
            <div
              key={index}
              className="notice"
              onClick={() => navigate("/mycar/maintenance")}
            >
              <h3>{item.name}</h3>
            </div>
          ))
        ) : hasBoardsWithPosts ? (
          // boardsWithPosts 배열이 있을 경우만 접근
          boardsWithPosts[0].posts.map((post, index) => (
            <div
              key={index}
              className="notice"
              onClick={() => handleNoticeClick(post.id)}
            >
              <h3>{post.title}</h3>
              <p>{post.createdAt.split("T")[0]}</p>
            </div>
          ))
        ) : (
          <div className="notice">게시글이 없습니다.</div> // 데이터가 없을 경우 표시
        )}
      </Slider>
    </div>
  );
};

export default NoticeZone;
