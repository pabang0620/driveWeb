import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";

const clientKey = "_";
const customerKey = "_";

export default function Payment() {
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(50_000);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        price
      );

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    })();
  }, [price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(
      price,
      paymentMethodsWidget.UPDATE_REASON.COUPON
    );
  }, [price]);

  const handlePaymentClick = async () => {
    const paymentWidget = paymentWidgetRef.current;

    try {
      await paymentWidget.requestPayment({
        orderId: nanoid(),
        orderName: "토스 티셔츠 외 2건",
        customerName: "김토스",
        customerEmail: "customer123@gmail.com",
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="payment_container">
      <div id="payment-widget" className="content">
        <div className="payment_info">
          <h3>
            운행일지를 더욱 더<br />
            편리하게 관리해보세요!
          </h3>
          <p>구독하면 더 자세하고 친절하게 운행일지 데이터를 볼 수 있습니다.</p>
          <p>
            정기 구독으로 고급 분석 기능과 사용자 맞춤형 보고서를 제공받으세요.
          </p>
          <p> 더욱 편리하게 관리하고 필요한 정보를 놓치지 마세요!</p>
        </div>
        <div className="premium_benefits">
          <div>
            <div className="imgbox"></div>운행일지 차트로 보기
          </div>
          <div>
            {" "}
            <div className="imgbox"></div>손익계산서
          </div>
          <div>
            {" "}
            <div className="imgbox"></div>종합소득세
          </div>
        </div>
        {/* <div>
        // 할인제도 있다면
        <input
          type="checkbox"
          onChange={(event) => {
            setPrice(event.target.checked ? price - 5_000 : price + 5_000);
          }}
        />
      </div> */}
        <button onClick={handlePaymentClick} className="payment_button">
          멤버십 가입하기
        </button>
      </div>
      <style jsx>{`
        .payment_container {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;

          .content {
            margin: 0 auto;
            padding: ;

            border-radius: 4px;
            .payment_info {
              text-align: center;
              h3 {
                font-size: 35px;
                font-weight: 700;
                margin-bottom: 10px;
                color: #007bff;
              }

              p {
                font-size: 15px;
                line-height: 2;
                color: #666;
              }
            }
            .premium_benefits {
              width: 100%;
              display: flex;
              justify-content: space-around;
              border: 1px solid #d9d9d9;
              margin-top: 50px;
              > div {
                display: flex;
                flex-wrap: wrap;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                width: 33%;
                padding: 2%;
                font-size: 13px;
                .imgbox {
                  width: 30%;
                  aspect-ratio: 1/1;
                  background-color: gold;
                }
                &:not(:nth-of-type(3n)) {
                  border-right: 1px solid #d9d9d9;
                }
              }
            }
            .payment_button {
              display: block;
              width: 20%;
              padding: 15px;
              margin: 50px auto 0 auto;
              font-size: 18px;
              font-weight: 600;
              color: #fff;
              background-color: #007bff;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              transition: background-color 0.3s ease;
              &:hover {
                background-color: #0056b3;
              }
              &:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba;
              }
            }
          }
        }
      `}</style>
    </div>
  );
}
