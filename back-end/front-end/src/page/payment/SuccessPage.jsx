import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // JWT 디코딩을 위해 추가

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [nickname, setNickname] = useState(""); // 닉네임 상태 추가

  const token = localStorage.getItem("token");

  const [orderState, setOrderState] = useState(null);
  // 1="1개월(30일)", 2="6개월(180일)", 3="12개월(365일)"

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
      customerName: searchParams.get("customerName"),
    };

    async function confirm() {
      const response = await fetch("/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        navigate(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      // 결제 성공 비즈니스 로직을 추가하세요.
      const selectedPlanId = requestData.orderId.split("_")[1]; // 주문 아이디에서 선택한 결제 아이디 추출
      setOrderState(selectedPlanId);
      console.log(selectedPlanId);
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

      <style jsx>{`
        .result.wrapper {
          background-color: rgb(244, 244, 244);
          height: calc(100vh - 300px);
          position: relative;
          .box_section {
            max-width: 350px;
            width: 70%;
            position: absolute;
            left: 50%;
            top: 50%;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            transform: translate(-50%, -50%);
            @media (max-width: 768px) {
              width: 100%;
              max-width: 100%;
              height: 100%;
              border-radius: 0px;
              box-shadow: 0 0 0;
              display: flex;
              flex-wrap: wrap;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
          }

          h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            color: #4caf50;
          }

          p {
            font-size: 16px;
            line-height: 25px;
            margin-bottom: 30px;
          }

          .navyBox {
            width: 100%;
            padding: 12px;
            background-color: #3c5997;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.3s;

            @media (max-width: 768px) {
              width: 70%;
              font-size: 16px;
            }
            a {
              color: white;
              display: inline-block;
              width: 100%;
              height: 100%;
            }
            &:hover {
              background-color: #7388b6;
            }
          }
        }
      `}</style>
    </div>
  );
}
