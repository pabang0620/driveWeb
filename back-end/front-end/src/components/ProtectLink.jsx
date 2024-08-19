import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectLink = ({ to, permissionLevels, children, ...rest }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      const userPermission = decoded?.permission;

      if (!permissionLevels.includes(userPermission)) {
        alert("로그인 해주세요.");
        e.preventDefault(); // 경로 이동 막기
      }
    } else {
      alert("로그인 해주세요.");
      e.preventDefault(); // 경로 이동 막기
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};

export default ProtectLink;
