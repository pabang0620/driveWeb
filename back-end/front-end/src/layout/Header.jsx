import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // JWT 디코딩을 위해 추가
import SidebarMenu from "./SidebarMenu"; // 사이드바 메뉴 컴포넌트 추가
import "./layout.scss";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userPermission, setUserPermission] = useState(null); // 사용자 권한 상태 추가
  const [nickname, setNickname] = useState(""); // 닉네임 상태 추가

  const hideNav =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserPermission(decoded.permission); // 사용자 권한 설정
      console.log(decoded.permission);

      const storedNickname = localStorage.getItem("nickname");
      if (storedNickname) {
        setNickname(storedNickname); // 닉네임 설정
      }
    }
  }, [token]); // 컴포넌트가 마운트될 때 한 번 실행

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getSelectedClass = (pathPrefix) => {
    if (pathPrefix === "/") {
      return currentPath === pathPrefix ? "selected" : "";
    }
    return currentPath.startsWith(pathPrefix) ? "selected" : "";
  };

  const handleLogout = () => {
    setShowSidebar(false);
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    navigate("/");
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
            {isLoggedIn && nickname && (
              <li className="nickname">반갑습니다, {nickname}님</li>
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
        </div>

        <nav className={hideNav ? "hidden" : ""}>
          <ul
            className="mainmenu"
            onMouseEnter={() => setShowSubMenu(true)}
            onMouseLeave={() => setShowSubMenu(false)}
          >
            <li className={getSelectedClass("/")}>
              <Link to="/">홈</Link>
            </li>
            <li className={getSelectedClass("/user")}>
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
            <li className={getSelectedClass("/mypage")}>
              <Link to="/mypage">마이페이지</Link>
            </li>
            <li className={getSelectedClass("/driving_log")}>
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
            <li className={getSelectedClass("/board")}>
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
                <li className="listOption">
                  <Link to="/board/post/myboard">작성한 게시글</Link>
                </li>
              </ul>
            </li>
            <li className={getSelectedClass("/ranking")}>
              <Link to="/ranking">랭킹</Link>
            </li>
            <li className={getSelectedClass("/payment")}>
              <Link to="/payment">프리미엄</Link>
            </li>
            {token && userPermission && [1, 2, 3].includes(userPermission) && (
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
            )}
          </ul>
        </nav>

        <SidebarMenu
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          setShowLogoutModal={setShowLogoutModal}
          handleLogout={handleLogout}
        />
        {/* 사이드바 메뉴 표시 */}
      </div>
    </header>
  );
}

export default Header;
