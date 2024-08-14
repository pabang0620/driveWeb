import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SubMenu from "./SubMenu";
import SidebarMenu from "./SidebarMenu"; // 사이드바 메뉴 컴포넌트 추가

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(true);
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
            <li className={currentPath === "/" ? "selected" : ""}>
              <Link to="/">홈</Link>
            </li>
            <li
              style={{ width: "66px", textAlign: "center" }}
              className={getSelectedClass("/user")}
            >
              <Link to="/user/personalInfo">회원정보</Link>
              <ul>
                <li>
                  <Link to="/user/personalInfo">개인정보</Link>
                </li>
                <li>
                  <Link to="/user/carInfo">차량정보</Link>
                </li>
                <li>
                  <Link to="/user/incomeInfo">지출정보</Link>
                </li>
              </ul>
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
              <ul>
                <li className="listOption">
                  <Link to="/driving_log/dashboard">대쉬보드</Link>
                </li>
                <li className="listOption">
                  <Link to="/driving_log">운행일지</Link>
                </li>
              </ul>
            </li>
            <li className={getSelectedClass("/mycar")}>
              <Link to="/mycar">차계부</Link>
              <ul>
                <li className="listOption">
                  <Link to="/mycar">차량정보</Link>
                </li>
                <li className="listOption">
                  <Link to="/mycar/maintenance">정비항목</Link>
                </li>
                <li className="listOption">
                  <Link to="/mycar/log">정비이력</Link>
                </li>
              </ul>
            </li>
            <li
              style={{ width: "78px", textAlign: "center" }}
              className={getSelectedClass("/board")}
            >
              <Link to="/board">게시판</Link>
              <ul>
                <li className="listOption">
                  <Link to="/board/list/1">공지사항</Link>
                </li>
                <li className="listOption">
                  <Link to="/board/list/2">자유게시판</Link>
                </li>
                <li className="listOption">
                  <Link to="/board/post/add">글쓰기</Link>
                </li>
              </ul>
            </li>
            <li
              style={{ width: "42px", textAlign: "center" }}
              className={getSelectedClass("/ranking")}
            >
              <Link to="/ranking">랭킹</Link>
            </li>
            <li className={getSelectedClass("/payment")}>
              <Link to="/payment">프리미엄</Link>
            </li>
            <li className={getSelectedClass("/admin_page")}>
              <Link to="/admin/user">관리자페이지</Link>
              <ul>
                <li>
                  <Link to="/admin/user">회원관리</Link>
                </li>
                <li>
                  <Link to="/admin/ranking">랭킹관리</Link>
                </li>
                <li>
                  <Link to="/admin/statistics">통계관리</Link>
                </li>
                <li>
                  <Link to="/admin/board">게시판관리</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        <SidebarMenu
          showSidebar={showSidebar}
          setShowLogoutModal={setShowLogoutModal}
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
                height: 60px;
              }
              @media (max-width: 480px) {
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
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
                gap: 15px;
                margin-left: auto;
                li {
                  font-size: 14px;
                  cursor: pointer;
                  border-radius: 5px;
                  height: 40px;
                  line-height: 40px;
                  font-weight: bold;

                  @media (max-width: 768px) {
                    font-size: 14px;
                    padding: 0 3vw;
                    height: 30px;
                    line-height: 30px;
                  }
                  a {
                    display: block;
                    width: 100%;
                    height: 100%;
                    line-height: inherit;
                    font-weight: 500;
                    padding: 0 15px;
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
              white-space: nowrap;
              width: 100%;
              position: relative;
              height: 27px;
              z-index: 10;
              ul.mainmenu {
                height: 27px;
                position: absolute;
                overflow: hidden;
                transition: height 0.5s ease-in-out;
                background-color: #ffffff;
                &:hover {
                  cursor: pointer;
                  height: 170px;
                  border-bottom-left-radius: 7px;
                  border-bottom-right-radius: 7px;
                  border-bottom: 1px solid #ddd;
                }
              }
            }

            nav ul.mainmenu {
              display: flex;
              width: auto;
              gap: 15px;
              > li {
                cursor: pointer;
                font-weight: 500;
                font-size: 15px;
                position: relative;
                > a {
                  padding: 0 10px 5px 10px;
                  display: block;
                  width: 100%;
                  text-align: center;
                }
                &.selected {
                  > a {
                    color: #3c5997;
                    position: relative;
                    &::after {
                      content: "";
                      position: absolute;
                      left: 0;
                      bottom: 0px;
                      width: 100%;
                      border-bottom: 3px solid #3c5997;
                    }
                  }
                }
                &:hover {
                  > a {
                    color: #7388b6;
                    position: relative;
                    &::after {
                      content: "";
                      position: absolute;
                      left: 0;
                      bottom: 0px;
                      width: 100%;
                      border-bottom: 3px solid #7388b6;
                    }
                  }
                }
              }
              > li ul {
                width: 100%;
                height: auto;
                display: flex;
                flex-direction: column;
                text-align: center;
                font-size: 13px;
                padding: 5px 0 30px 0;
                li {
                  cursor: pointer;
                  border-radius: 5px;
                  transition: background-color 0.3s ease, color 0.3s ease;
                  &:hover {
                    background-color: #f0f3f5;
                    color: #3c5997;
                  }
                  a {
                    padding: 3px;
                    display: block;
                    text-align: center;
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
            margin-right: 15px;
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
                      background-color: #9ab1d6; /* 약간 밝게 */
                    }
                  }
                  &:nth-of-type(2) {
                    background-color: #3c5997;
                    &:hover {
                      background-color: #2c4375; /* 약간 어둡게 */
                    }
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
