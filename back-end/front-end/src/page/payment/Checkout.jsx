import { useState, useEffect } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import useCheckPermission from "../../utils/useCheckPermission";
import { jwtDecode } from "jwt-decode";
import "./payment.scss";

// const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
// const customerKey = "zwjv-5AOX_iBbBPZZoE-8";

// paymentKey, orderId는 서버에 필수로 저장하세요.
// 결제 조회, 결제 취소에 사용되는 값입니다. 나머지 값들은 필요에 따라 저장하세요.

function Checkout({ plans, nickname, email, phone }) {
  useCheckPermission();

  const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
  const [decodedUserId, setDecodedUserId] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setDecodedUserId(decoded.userId);
  }, []);

  const customerKey = `user_${decodedUserId}`;

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: null,
  });

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);

      // 회원 결제
      const widgets = tossPayments.widgets({ customerKey });

      // 비회원 결제
      // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

      setWidgets(widgets);
    }
    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets === null) return;

      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);
      setReady(true);
    }
    renderPaymentWidgets();
  }, [widgets, amount]); // amount 의존성 추가

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setAmount({
      currency: "KRW",
      value: plan.discountedPrice, // 선택된 플랜의 할인 가격으로 업데이트
    });
  };

  const handlePaymentRequest = async () => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
    let userId = null;

    if (token) {
      try {
        const decoded = jwtDecode(token); // 토큰 디코딩
        userId = decoded.userId; // userId 추출
      } catch (error) {
        console.error("토큰 디코딩 오류:", error);
        alert("아이디를 읽을 수 없습니다.");
      }
    }

    const selectedPlanId = selectedPlan ? selectedPlan.id : "defaultPlan"; // 선택된 플랜의 ID

    // 현재 날짜를 YYYYMMDD 형식으로 포맷팅합니다.
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");

    // 주문 ID 생성
    const orderId = `${formattedDate}${userId}_${Math.floor(
      Math.random() * 1000
    )}${selectedPlanId}`;
    // 주문아이디orerId = (날짜)(유저아이디)_(랜덤숫자)(선택한결제아이디)
    // 선택한결제아이디 1="1개월(30일)", 2="6개월(180일)", 3="12개월(365일)"

    try {
      await widgets.requestPayment({
        orderId: orderId, // 생성된 주문 ID

        orderName: `회원권: ${
          selectedPlan ? selectedPlan.duration : "선택되지 않음"
        }`,

        successUrl: `${window.location.origin}/payment/success`,

        failUrl: window.location.origin + "/payment/fail",

        customerEmail: email,
        customerName: nickname,
        customerMobilePhone: phone,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="checkout_page">
      <div className="plans">
        <h3>구독 플랜 선택</h3>
        {plans.map((plan) => (
          <div
            key={plan.duration}
            className={`plan ${
              selectedPlan && selectedPlan.duration === plan.duration
                ? "selected"
                : ""
            }`}
            onClick={() => handlePlanSelect(plan)}
          >
            <h4>{plan.duration}</h4>
            <p>
              {plan.discountedPrice.toLocaleString()}원
              {plan.originalPrice !== plan.discountedPrice && (
                <span className="discount">
                  {plan.originalPrice.toLocaleString()}원 →{" "}
                  {plan.discountedPrice.toLocaleString()}원 ({plan.discount}%
                  할인)
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="payment-section">
        <div id="payment-method" />
        <div id="agreement" />
        <div className="buttonBox">
          <button disabled={!ready} onClick={handlePaymentRequest}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
