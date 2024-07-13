import React from "react";
import { Link } from "react-router-dom";

function SubMenu() {
  return (
    <div className="submenu">
      <ul className="width-2">
        <li className="listOption">홈</li>
      </ul>
      <ul className="width-5-5">
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
      <ul className="width-7">
        <li className="listOption">마이페이지</li>
      </ul>
      <ul className="width-5-5">
        <li className="listOption">대쉬보드</li>
        <li className="listOption">운행일지</li>
      </ul>
      <ul className="width-4-3">
        <li className="listOption">
          <Link to="/user/carInfo">차량정보</Link>
        </li>
        <li className="listOption">정비항목</li>
        <li className="listOption">정비이력</li>
      </ul>
      <ul className="width-4-3 widthBoard">
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
      <ul className="width-3-2">
        <li className="listOption">
          {" "}
          <Link to="/rank">랭킹</Link>
        </li>
      </ul>
      <ul className="width-8">
        <li className="listOption">관리자 페이지</li>
      </ul>

      <style jsx>{`
        .submenu {
          position: absolute;
          left: 0px;
          top: 34px;
          width: 100%;
          margin: 0 auto;
          max-width: 1200px;
          height: 140px;
          background-color: #ffffff;
          display: flex;
          border-bottom-left-radius: 7px;
          border-bottom-right-radius: 7px;
          gap: 15px;
          overflow: hidden;
          animation: slideDown 0.5s ease-in-out;
          .listOption {
            font-size: 13px;
            border-radius: 5px;
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .listOption:hover {
            background-color: #f0f3f5;
            color: #3c5997;
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
        .submenu ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .width-2 li {
          width: 23px;
          text-align: center;
        }
        .width-5-5 li {
          width: 66px;
          text-align: center;
        }

        .width-7 li {
          width: 84px;
          text-align: center;
        }
        .width-4-3 li {
          width: 66px;
          text-align: center;
        }
        .widthBoard li {
          width: 78px;
          text-align: center;
        }
        .width-3-2 li {
          width: 42px;
          text-align: center;
        }
        .width-8 li {
          width: 90px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default SubMenu;
