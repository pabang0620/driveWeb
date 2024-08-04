import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SubMenu from "./SubMenu";
import SidebarMenu from "./SidebarMenu"; // 사이드바 메뉴 컴포넌트 추가

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // 사이드바 상태 추가

  const hideNav =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

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

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getSelectedClass = (pathPrefix) => {
    return currentPath.startsWith(pathPrefix) ? "selected" : "";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setShowLogoutModal(false);
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className={hideNav ? "hidden" : ""}>
      <div className="header_inner">
        <div className="header_one">
          <button
            className="hamburger-menu"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
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
            {!isLoggedIn && (
              <li>
                <Link to="/signup">회원가입</Link>
              </li>
            )}
            {isLoggedIn ? (
              <li onClick={() => setShowLogoutModal(true)}>로그아웃</li>
            ) : (
              <li>
                <Link to="/login">로그인</Link>
              </li>
            )}
          </ul>
          {showLogoutModal && (
            <div className="logout_modal">
              <div className="modal_content">
                <p>정말 로그아웃 하시겠습니까?</p>
                <button onClick={handleLogout}>로그아웃</button>
                <button onClick={() => setShowLogoutModal(false)}>
                  로그인 유지
                </button>
              </div>
            </div>
          )}
        </div>
        <nav className={hideNav ? "hidden" : ""}>
          <ul
            className="mainmenu"
            onMouseEnter={() => setShowSubMenu(true)}
            onMouseLeave={() => setShowSubMenu(false)}
          >
            {showSubMenu && <SubMenu />}
            <li
              style={{ width: "24px", textAlign: "center" }}
              className={currentPath === "/" ? "selected" : ""}
            >
              <Link to="/">홈</Link>
            </li>
            <li
              style={{ width: "66px", textAlign: "center" }}
              className={getSelectedClass("/user")}
            >
              <Link to="/user/personalInfo">회원정보</Link>
            </li>
            <li
              style={{ width: "84px", textAlign: "center" }}
              className={getSelectedClass("/mypage")}
            >
              <Link to="/mypage">마이페이지</Link>
            </li>
            <li
              style={{ width: "66px", textAlign: "center" }}
              className={getSelectedClass("/driving_log")}
            >
              <Link to="/driving_log">운행일지</Link>
            </li>
            <li
              style={{ width: "66px", textAlign: "center" }}
              className={getSelectedClass("/mycar")}
            >
              <Link to="/mycar">차계부</Link>
            </li>
            <li
              style={{ width: "78px", textAlign: "center" }}
              className={getSelectedClass("/board")}
            >
              <Link to="/board">게시판</Link>
            </li>
            <li
              style={{ width: "42px", textAlign: "center" }}
              className={getSelectedClass("/ranking")}
            >
              <Link to="/ranking">랭킹</Link>
            </li>
            <li
              style={{ width: "82.81px", textAlign: "center" }}
              className={getSelectedClass("/admin_page")}
            >
              <Link to="/admin_page">관리자페이지</Link>
            </li>
          </ul>
        </nav>
        <SidebarMenu
          showSidebar={showSidebar}
          onClose={() => setShowSidebar(false)}
        />
        {/* 사이드바 메뉴 표시 */}
        <style jsx>{`
          header {
            width: 100%;
            background-color: white;

            &.scrolling {
              top: -60px;
            }
            .header_inner {
              width: 80%;
              margin: 0 auto;
              max-width: 1200px;
              @media (max-width: 768px) {
                width: 90%;
              }
            }
            .header_one {
              width: 100%;
              height: 60px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              @media (max-width: 768px) {
                height: 50px;
              }
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
                @media (max-width: 768px) {
                  width: 45%;
                }
                li {
                  font-size: 14px;
                  cursor: pointer;
                  border-radius: 5px;
                  height: 40px;
                  line-height: 40px;
                  font-weight: bold;
                  padding: 0 15px;
                  @media (max-width: 768px) {
                    font-size: 4vw;
                    padding: 0 3vw;
                    height: 30px;
                    line-height: 30px;
                  }
                  a {
                    width: 100%;
                    height: 100%;
                    display: inline;
                    font-weight: 500;
                  }
                  &:nth-of-type(1) {
                    background-color: #f0f3f5;
                    @media (max-width: 768px) {
                      display: none;
                    }
                  }
                  &:nth-of-type(2) {
                    background-color: #3c5997;
                    color: white;
                    a {
                      color: white;
                    }
                  }
                }
              }
            }

            nav {
              white-space: nowrap;
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
                margin: 0 3px;
                font-size: 15px;
                &.selected {
                  border-bottom: 3px solid #3c5997;
                  a {
                    color: #3c5997;
                  }
                }
              }
            }
            .logout_modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 2;
              .modal_content {
                background: white;
                padding: 30px 10px;
                border-radius: 5px;
                text-align: center;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
                z-index: 3;

                p {
                  width: 100%;
                  margin-bottom: 30px;
                }
                button {
                  width: 30%;
                  padding: 10px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;

                  color: white;
                  cursor: pointer;
                  &:nth-of-type(1) {
                    background-color: #7388b6;
                    &:hover {
                      background-color: #9ab1d6;
                    }
                  }
                  &:nth-of-type(2) {
                    background-color: #3c5997;
                    &:hover {
                      background-color: #2c4375;
                    }
                  }
                }
              }
            }
          }
          .hamburger-menu {
            display: none; /* 기본적으로 숨기기 */
            flex-direction: column;
            align-items: center;
            background: transparent;
            border: none;
            cursor: pointer;
            .bar {
              width: 24px;
              height: 2.5px;
              background: #333;
              margin: 2.5px 0;
              border-radius: 2px;
            }
          }
          @media (max-width: 768px) {
            /* 테블릿 및 모바일 사이즈 */
            .hamburger-menu {
              display: flex; /* 햄버거 메뉴 아이콘 표시 */
            }
            nav {
              display: none; /* 기본 내비게이션 숨기기 */
            }
            .header_inner {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </header>
  );
}

export default Header;
