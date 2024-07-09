import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  // 로그인 및 회원가입 페이지에서는 네비게이션을 숨김
  const hideNav =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  // 스크롤에 따라 헤더가 위로 움직이도록 처리
  const handleScroll = () => {
    const header = document.querySelector("header");
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("scrolling");
      } else {
        header.classList.remove("scrolling");
      }
    }
  };

  // 페이지가 로드될 때 스크롤 이벤트 리스너 등록
  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 현재 경로와 비교하여 선택된 클래스를 반환하는 함수
  const getSelectedClass = (pathPrefix) => {
    return currentPath.startsWith(pathPrefix) ? "selected" : "";
  };

  return (
    <header className={hideNav ? "hidden" : ""}>
      <div className="header_inner">
        <div className="header_one">
          <h1>
            <Link to="/">
              운행일지
              <img
                src={`${process.env.PUBLIC_URL}/images/mainlogo_2.png`}
                alt=""
              />
            </Link>
          </h1>
          <ul className="login">
            <li>
              <Link to="/signup">회원가입</Link>
            </li>
            <li>
              <Link to="/login">로그인</Link>
            </li>
          </ul>
        </div>
        <nav className={hideNav ? "hidden" : ""}>
          <ul className="mainmenu">
            <li className={currentPath === "/" ? "selected" : ""}>
              <Link to="/">홈</Link>
            </li>
            <li className={getSelectedClass("/user")}>
              <Link to="/user/personalInfo">회원정보</Link>
            </li>
            <li className={getSelectedClass("/mypage")}>
              <Link to="/mypage">마이페이지</Link>
            </li>
            <li className={getSelectedClass("/driving_log")}>
              <Link to="/driving_log">운행일지</Link>
            </li>
            <li className={getSelectedClass("/car_ledger")}>
              <Link to="/car_ledger">차계부</Link>
            </li>
            <li className={getSelectedClass("/board")}>
              <Link to="/board">게시판</Link>
            </li>
            <li className={getSelectedClass("/ranking")}>
              <Link to="/ranking">랭킹</Link>
            </li>
            <li className={getSelectedClass("/admin_page")}>
              <Link to="/admin_page">관리자페이지</Link>
            </li>
          </ul>
        </nav>
        <style jsx>{`
          header {
            width: 100%;
            background-color: white;

            &.scrolling {
              top: -60px; /* 헤더를 숨기고 싶은 만큼의 높이 */
            }
            .header_inner {
              width: 80%;
              margin: 0 auto;
              max-width: 1200px;
            }
            .header_one {
              width: 100%;
              height: 60px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              h1 {
                font-size: 18px;
                line-height: 50px;
                font-weight: bold;
                img {
                  height: 35px;
                  width: auto;
                }

                a {
                  display: inline-block;
                  display: flex;
                  align-items: center;
                  color: #4c4c4c;
                }
              }
              ul.login {
                width: 80%;
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
                gap: 15px;
                li {
                  font-size: 14px;
                  cursor: pointer;
                  border-radius: 5px;
                  height: 40px;
                  line-height: 40px;
                  font-weight: bold;
                  a {
                    display: inline-block;
                    padding: 0 15px;
                    font-weight: 500;
                  }
                  &:nth-of-type(1) {
                    background-color: #f0f3f5;
                  }
                  &:nth-of-type(2) {
                    background-color: #3c5997;
                    a {
                      color: white;
                    }
                  }
                }
              }
            }

            nav {
              width: 100%;
              margin-top: 15px;
              position: relative;
            }
            nav:hover {
              cursor: pointer;
              .submenu {
                display: flex;
              }
            }

            nav .mainmenu {
              display: flex;
              gap: 15px;
              li {
                cursor: pointer;
                font-weight: 500;
                padding: 5px;
                font-size: 15px;
                &.selected {
                  border-bottom: 3px solid #3c5997;
                  a {
                    color: #3c5997;
                  }
                }
              }
            }
          }
        `}</style>
      </div>
    </header>
  );
}

export default Header;
