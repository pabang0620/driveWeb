import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NoticeZone = ({ boardsWithPosts }) => {
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

  return (
    <div className="noticeZone">
      <Slider {...settings}>
        {boardsWithPosts[1]?.posts.map((post, index) => (
          <div key={index} className="notice">
            <h3>{post.title}</h3>
            <p>{post.createdAt.split("T")[0]}</p>
          </div>
        ))}
      </Slider>
      <style jsx>{`
        .noticeZone {
          width: 100%;
          padding: 7px 10px;
          background-color: #f0f3f5;
          border-radius: 10px;
          .notice {
            h3 {
              font-size: 14px;
              font-weight: normal;
              display: inline-block;
              color: #4c4c4c;
            }
            p {
              font-size: 13px;
              text-align: right;
              float: right;
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
