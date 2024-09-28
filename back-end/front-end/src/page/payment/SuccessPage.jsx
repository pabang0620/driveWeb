import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // JWT 디코딩을 위해 추가
import axios from "axios"; // axios 사용
import "./payment.scss";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [nickname, setNickname] = useState(""); // 닉네임 상태 추가

  const token = localStorage.getItem("token");

  const [orderState, setOrderState] = useState(null);
  // 1="1개월(30일)", 2="6개월(180일)", 3="12개월(365일)"

  function calculateExpirationDate(orderState) {
    const now = new Date();

    // orderState의 마지막 자리 숫자를 추출 (문자열이므로)
    const lastDigit = Number(orderState.slice(-1)); // orderState의 마지막 자리 추출

    if (lastDigit === 1) {
      now.setMonth(now.getMonth() + 1); // 1개월 추가
    } else if (lastDigit === 2) {
      now.setMonth(now.getMonth() + 6); // 6개월 추가
    } else if (lastDigit === 3) {
      now.setFullYear(now.getFullYear() + 1); // 12개월 추가
    }
    return now.toISOString(); // ISO 형식으로 반환
  }

  // 결제 정보 서버로 POST (axios 사용)
  async function savePaymentData(paymentData) {
    try {
      const response = await axios.post("/api/payments/success", paymentData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("결제 정보 저장 성공:", paymentData);
      } else {
        console.error("결제 정보 저장 실패:", response.data);
      }
    } catch (error) {
      console.error("결제 정보 저장 실패:", error);
    }
  }

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
      customerName: searchParams.get("customerName"),
    };

    async function confirm() {
      try {
        const response = await axios.post(
          "/api/payments/confirm",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const json = response.data;

        if (response.status !== 200) {
          navigate(`/fail?message=${json.message}&code=${json.code}`);
          return;
        }

        // 결제 성공 비즈니스 로직 추가
        const selectedPlanId = requestData.orderId.split("_")[1]; // 주문 아이디에서 선택한 결제 아이디 추출
        setOrderState(selectedPlanId);
        console.log(selectedPlanId);

        // 만료 기간 계산
        const expirationDate = calculateExpirationDate(selectedPlanId);

        // 유저 정보 (userId) 추출
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; // JWT에서 userId 추출

        // 현재 날짜 (결제 시간)
        const paymentDate = new Date().toISOString();

        // 서버로 결제 정보 전송 (orderState 포함)
        await savePaymentData({
          userId,
          orderId: requestData.orderId,
          amount: requestData.amount,
          orderState: selectedPlanId, // orderState 추가
          paymentDate,
          expirationDate,
        });
      } catch (error) {
        console.error("결제 확인 오류:", error);
        navigate(`/fail?message=${error.message}`);
      }
    }

    confirm();
  }, [searchParams, navigate]);

  useEffect(() => {
    if (token) {
      const storedNickname = localStorage.getItem("nickname");
      if (storedNickname) {
        setNickname(storedNickname); // 닉네임 설정
      }
    }
  }, [token]); // 컴포넌트가 마운트될 때 한 번 실행

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공!</h2>
        <p>
          {`${nickname}님, 주문이 완료되었습니다.`}
          <br />
          유료서비스를 이용해보세요!
        </p>
        <p>{`주문번호: ${searchParams.get("orderId")}`}</p>

        <p>{`결제 금액: ${Number(
          searchParams.get("amount")
        ).toLocaleString()}원`}</p>

        <p>{`결제 키: ${searchParams.get("paymentKey")}`}</p>

        <a href="/" className="navyBox">
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
