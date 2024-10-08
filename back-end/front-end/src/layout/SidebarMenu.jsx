// SidebarMenu.js
import React from "react";
import { Link } from "react-router-dom";

function SidebarMenu({ onClose, showSidebar, setShowLogoutModal }) {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <div className={`sidebar-menu ${showSidebar ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <h1>
        <Link to="/">
          운행일지
          <img src={`${process.env.PUBLIC_URL}/images/mainlogo_2.png`} alt="" />
        </Link>
      </h1>
      {!isLoggedIn && (
        <p className="loginText">
          로그인하면, 운행일지를 쉽게 보고 편리하게 관리할 수 있어요.
        </p>
      )}
      <ul className="login">
        {!isLoggedIn && (
          <li>
            <Link to="/signup" onClick={onClose}>
              회원가입
            </Link>
          </li>
        )}
        {isLoggedIn ? (
          <li onClick={() => setShowLogoutModal(true)}>로그아웃</li>
        ) : (
          <li>
            <Link to="/login" onClick={onClose}>
              로그인
            </Link>
          </li>
        )}
      </ul>
      <ul className="sideMenu">
        <li>
          <Link to="/">홈</Link>
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
          </ul>
        </li>
        <li>
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
        <li>
          <Link to="/mypage">마이페이지</Link>
          <ul>
            <li>
              <Link to="/mypage">마이페이지</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/driving_log">운행일지</Link>
          <ul>
            <li>
              <Link to="/driving_log/dashboard">대쉬보드</Link>
            </li>
            <li>
              <Link to="/driving_log">운행일지</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/mycar">차계부</Link>
          <ul>
            <li>
              <Link to="/mycar">차량정보</Link>
            </li>
            <li>
              <Link to="/mycar/maintenance">정비항목</Link>
            </li>
            <li>
              <Link to="/mycar/log">정비이력</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/board">게시판</Link>
          <ul>
            <li>
              <Link to="/board">게시판</Link>
            </li>
            <li>
              <Link to="/board/list/1">공지사항</Link>
            </li>
            <li>
              <Link to="/board/list/2">자유게시판</Link>
            </li>
            <li>
              <Link to="/board/post/add">글쓰기</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/ranking">랭킹</Link>
          <ul>
            <li>
              <Link to="/ranking">랭킹</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/admin_page">관리자페이지</Link>
        </li>
      </ul>
      <style jsx>{`
        .sidebar-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 50vw;
          height: 100vh;
          background-color: white;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          padding: 50px 25px 100px 25px;
          z-index: 100;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          overflow-y: scroll;
          @media (max-width: 480px) {
            width: 100vw;
            height: 100vh;
          }
          &.open {
            transform: translateX(0);
          }
          .close-btn {
            position: absolute;
            top: 25px;
            right: 25px;
            align-self: flex-end;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
          }
          h1 {
            a {
              font-size: 24px;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              font-weight: bold;
              img {
                height: 45px;
                padding-top: 5px;
              }
            }
          }
          p.loginText {
            font-size: 14px;
            color: rgb(157 164 174);
            margin: 10px 0;
            width: 100%;
            @media (max-width: 480px) {
              font-size: 12px;
            }
          }
          ul.login {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            gap: 5px;
            margin-top: 5px;
            li {
              width: 100%;
              text-align: center;
              font-size: 18px;
              cursor: pointer;
              border-radius: 5px;
              height: 40px;
              line-height: 40px;
              font-weight: bold;
              padding: 0 15px;
              @media (max-width: 480px) {
                font-size: 16px;
              }
              a {
                width: 100%;
                height: 100%;
                display: inline;
                font-weight: 500;
              }
              &:nth-of-type(1) {
                background-color: #f0f3f5;
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
          ul.sideMenu {
            list-style: none;
            margin-top: 20px;
            > li {
              padding: 10% 0;
              @media (max-width: 480px) {
                padding: 5% 0;
              }
              &:not(:last-of-type) {
                border-bottom: 1px solid #ddd;
                > a {
                  font-weight: bold;
                  color: #222;
                  font-size: 15px;
                  @media (max-width: 480px) {
                    font-size: 13px;
                  }
                }
              }
              ul {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                margin-top: 10px;
                gap: 5px;
                justify-content: space-between;
                li {
                  width: 45%;

                  a {
                    color: #333;
                    font-size: 18px;
                    @media (max-width: 480px) {
                      font-size: 16px;
                    }
                  }
                }
              }
            }
            a {
              text-decoration: none;
            }
            a:hover {
              color: #3c5997;
            }
          }
        }
      `}</style>
    </div>
  );
}

export default SidebarMenu;
