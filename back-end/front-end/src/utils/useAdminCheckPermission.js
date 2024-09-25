import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function useAdminCheckPermission() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermission = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const userPermission = decoded.permission;

          // 권한이 4 또는 5인 경우 관리자 접근 제한
          if (userPermission === 4 || userPermission === 5) {
            alert("관리자만 접근 가능합니다.");
            navigate("/login");
          }
          // 유효하지 않은 권한인 경우 로그인 페이지로 이동
          else if (![1, 2, 3, 4, 5].includes(userPermission)) {
            alert("로그인 해주세요.");
            navigate("/login");
          }
        } catch (error) {
          console.error("토큰 디코딩 오류:", error);
          alert("로그인 해주세요.");
          navigate("/login");
        }
      } else {
        alert("로그인 해주세요.");
        navigate("/login");
      }
    };

    checkPermission();
  }, [navigate]);
}

export default useAdminCheckPermission;
