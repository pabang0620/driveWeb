import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function useCheckPermission() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermission = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const userPermission = decoded.permission;

          if (![1, 2, 3, 4, 5].includes(userPermission)) {
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

export default useCheckPermission;
