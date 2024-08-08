import React from "react";
import { Link } from "react-router-dom";

function SubMenu() {
  return (
    <div className="submenu">
      <ul className="liNone">
        <li className="listOption">
          <Link to="/">홈</Link>
        </li>
      </ul>
      <ul>
        <li className="listOption">
          <Link to="/user/personalInfo">개인정보</Link>
        </li>
        <li className="listOption">
          <Link to="/user/carInfo">차량정보</Link>
        </li>
        <li className="listOption">
          <Link to="/user/incomeInfo">지출정보</Link>
        </li>
      </ul>
      <ul>
        <li className="listOption">
          <Link to="/mypage">마이페이지</Link>
        </li>
      </ul>
      <ul>
        <li className="listOption">
          <Link to="/driving_log/dashboard">대쉬보드</Link>
        </li>
        <li className="listOption">
          <Link to="/driving_log">운행일지</Link>
        </li>
      </ul>
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
      <ul>
        <li className="listOption">
          <Link to="/board">게시판</Link>
        </li>
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
      <ul>
        <li className="listOption">
          <Link to="/ranking">랭킹</Link>
        </li>
      </ul>
      <ul>
        <li className="listOption">
          <Link to="/payment">프리미엄</Link>
        </li>
      </ul>
      <ul>
        <li className="listOption">
          <Link to="/admin_page">관리자페이지</Link>
        </li>
      </ul>

      <style jsx>{`
        .submenu {
          position: absolute;
          left: 0px;
          top: 27px;
          width: inherit;
          margin: 0 auto;

          background-color: #ffffff;
          display: flex;
          justify-content: flex-start;
          border-bottom-left-radius: 7px;
          border-bottom-right-radius: 7px;
          overflow: hidden;
          animation: slideDown 0.5s ease-in-out;
          width: 99%;
          gap: 20px;
          ul {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            font-size: 13px;
            width: auto;
            li {
              cursor: pointer;
              border-radius: 5px;
              transition: background-color 0.3s ease, color 0.3s ease;
              background-color: gold;
              a {
                display: inline-block;
                font-weight: 500;
                padding: 0 10px 5px 10px;
              }
              &:hover {
                background-color: #f0f3f5;
                color: #3c5997;
              }
            }
          }
        }

        @keyframes slideDown {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: 150px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default SubMenu;
