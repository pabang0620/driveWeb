import { useState, useEffect } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import useCheckPermission from "../../utils/useCheckPermission";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "zwjv-5AOX_iBbBPZZoE-8";

// paymentKey, orderId는 서버에 필수로 저장하세요.
// 결제 조회, 결제 취소에 사용되는 값입니다. 나머지 값들은 필요에 따라 저장하세요.

function Checkout() {
  useCheckPermission();

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: null,
  });
  // 각 플랜의 가격 정보
  const plans = [
    { duration: "3개월", originalPrice: 9900, discountedPrice: 9900 },
    {
      duration: "12개월",
      originalPrice: 39600,
      discountedPrice: 35000,
      discount: 12,
    },
    {
      duration: "36개월",
      originalPrice: 118800,
      discountedPrice: 99000,
      discount: 17,
    },
  ];

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
          <button
            disabled={!ready}
            onClick={async () => {
              try {
                await widgets.requestPayment({
                  orderId: "DigbpIqrafQ29-xKAatIS",
                  orderName: `회원권: ${
                    selectedPlan ? selectedPlan.duration : "선택되지 않음"
                  }`,
                  successUrl: `${
                    window.location.origin
                  }/payment/success?plan=${encodeURIComponent(
                    JSON.stringify(selectedPlan)
                  )}`,
                  failUrl: window.location.origin + "/payment/fail",
                  customerEmail: "customer123@gmail.com",
                  customerName: "김토스",
                  customerMobilePhone: "01012341234",
                });
              } catch (error) {
                console.error(error);
              }
            }}
          >
            결제하기
          </button>
        </div>
      </div>

      <style jsx>{`
        .checkout_page {
          padding: 10px;
          .plans {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            margin-top: 20px;
            .plan {
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
              cursor: pointer;
              text-align: center;
            }

            .plan.selected {
              border-color: #007bff;
              background-color: #f0f8ff;
            }
          }

          .discount {
            display: block;
            color: #999;
            font-size: 14px;
            text-decoration: line-through;
          }

          .payment-section {
            margin-top: 20px;
            .buttonBox {
              width: 100%;
              text-align: center;
              button {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                width: 100%;
                font-size: 16px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
              }

              button:disabled {
                background-color: #d0d0d0;
              }

              button:hover:not(:disabled) {
                background-color: #0056b3;
              }
            }
          }
        }
      `}</style>
    </div>
  );
}

export default Checkout;
