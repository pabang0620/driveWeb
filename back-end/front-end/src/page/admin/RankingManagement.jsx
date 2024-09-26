import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import TitleBox from "../../components/TitleBox";
import RankCategorySetting from "./RankCategorySetting";
import { jwtDecode } from "jwt-decode"; // JWT 디코딩 라이브러리
import useAdminCheckPermission from "../../utils/useAdminCheckPermission";
import "./admin.scss";

const RankingManagement = () => {
  const navigate = useNavigate();
  useAdminCheckPermission();

  const [userPermission, setUserPermission] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserPermission(decodedToken.permission);

      // 권한이 1 또는 2가 아닌 경우 홈으로 리디렉션
      if (decodedToken.permission !== 1 && decodedToken.permission !== 2) {
        alert("접근 권한이 없습니다.");
        navigate("/"); // 홈으로 리디렉션
      }
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 리디렉션
    }
  }, [navigate]);

  if (userPermission !== 1 && userPermission !== 2) {
    return null; // 권한이 없는 경우에는 아무것도 렌더링하지 않음
  }

  return (
    <div className="ranking-management">
      <TitleBox title="관리자페이지" subtitle="랭킹관리" />
      <RankCategorySetting />
    </div>
  );
};

export default RankingManagement;
