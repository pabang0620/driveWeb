import { useEffect, useRef, useState } from "react";
import Checkout from "./Checkout";
import { jwtDecode } from "jwt-decode"; // JWT 디코딩을 위해 추가
import "./payment.scss";

export default function Payment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permission, setPermission] = useState(null); // permission 상태 추가

  // 각 플랜의 가격 정보

  const plans = [
    {
      id: 1,
      duration: "1개월(30일)",
      originalPrice: 5900,
      discountedPrice: 5900,
    },
    {
      id: 2,
      duration: "6개월(180일)",
      originalPrice: 33000,
      discountedPrice: 24900,
      discount: 25,
    },
    {
      id: 3,
      duration: "12개월(365일)",
      originalPrice: 66900,
      discountedPrice: 33000,
      discount: 51,
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // JWT 토큰에서 permission 값을 가져오는 useEffect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setPermission(decodedToken.permission); // permission 값 설정
      } catch (error) {
        console.error("JWT 디코딩 오류:", error);
        setPermission(5);
      }
    }
  }, []);

  // 버튼의 텍스트 및 상태 결정
  const renderButton = () => {
    if (permission === 5) {
      // permission이 5인 경우
      return (
        <button onClick={openModal} className="payment_button">
          멤버십 가입하기
        </button>
      );
    } else if ([1, 2, 3, 4].includes(permission)) {
      // permission이 1, 2, 3, 4인 경우
      return (
        <button onClick={openModal} className="payment_button">
          멤버십 연장하기
        </button>
      );
    } else {
      // 그 외의 경우, 버튼 비활성화
      return (
        <button className="payment_button" disabled>
          멤버십 가입하기
        </button>
      );
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
          <p>
            정기 구독으로 고급 분석 기능과 <br className="mobile_br" />
            사용자 맞춤형 보고서를 제공받으세요.
          </p>
          <p>
            더욱 편리하게 관리하고 <br className="mobile_br" />
            필요한 정보를 놓치지 마세요!
          </p>
        </div>
        <div className="premium_benefits">
          <div>
            <div className="imgbox">📊</div>운행일지 차트로 보기
          </div>
          <div>
            <div className="imgbox">💰</div>손익계산서
          </div>
          <div>
            <div className="imgbox">🧾</div>종합소득세
          </div>
        </div>

        {renderButton()}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={closeModal} className="modal-close-button">
                ×
              </button>
              <Checkout plans={plans} />
            </div>
          </div>
        )}

        <div className="subscription_info">
          <h4>
            금액 <span>(VAT 포함)</span>{" "}
          </h4>
          <table>
            <thead>
              <tr>
                <th>제공기간</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.duration}>
                  <td>{plan.duration}</td>
                  <td>
                    {plan.originalPrice === plan.discountedPrice ? (
                      `${plan.discountedPrice.toLocaleString()}원`
                    ) : (
                      <>
                        <span className="original_price">
                          {plan.originalPrice.toLocaleString()}원
                        </span>{" "}
                        → {plan.discountedPrice.toLocaleString()}원 (
                        <span className="discount">{plan.discount}% 할인</span>)
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="premium_warning">
            *프리미엄 회원가입 후 서비스 제공 기간 중 운행일지 오류 등으로
            <br />
            프리미엄 서비스를 3시간 이상 원활히 제공하지 못한 경우, 서비스
            기간을 연장해드립니다.
          </p>
        </div>
        <div className="refund_policy">
          <h4>환불 정책</h4>
          <p>
            운행일지 환불 정책은
            <br className="mobile_br" />
            공정거래위원회의 표준약관을 준수합니다.
            <br />
          </p>
          <br />
          <p>서비스 이용일수를 제외하고 일할계산되어 환불 진행됩니다.</p>
          <p>
            *환불진행시 수수료가 발생한 경우
            <br />
            수수료와 할인율 등을 적용하여 환불되오니 다음 예시표를 확인하시기
            바랍니다.
            <br />
          </p>
          <br />
          <p className="refund_formula">
            환불 예상 요금 =<br className="mobile_br" /> [ 결제금액 / 서비스
            전체 일수 * <br className="mobile_br" />
            잔여일수 * (1 - 할인율) - <br className="mobile_br" />
            (위약금 + 수수료 등) ]
          </p>

          <ul>
            <li>
              1개월 요금 결제한 경우 <br className="mobile_br" />
              잔여기간 요금 100% 환불
            </li>
            <li>
              6개월 요금 결제한 경우 <br className="mobile_br" />
              잔여기간 요금 75% 환불
            </li>
            <li>
              12개월 요금 결제한 경우 <br className="mobile_br" />
              잔여기간 요금 50% 환불
            </li>
          </ul>
          <div className="refund_example">
            <table>
              <thead>
                <tr>
                  <th>
                    결제
                    <br className="mobile_br" />
                    구분
                  </th>
                  <th>
                    결제
                    <br className="mobile_br" />
                    요금
                  </th>
                  <th>
                    사용
                    <br className="mobile_br" />
                    기간
                  </th>
                  <th>
                    잔여
                    <br className="mobile_br" />
                    기간
                  </th>
                  <th>
                    환불예상
                    <br className="mobile_br" />
                    요금
                  </th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1개월</td>
                  <td>5,500원</td>
                  <td>10일</td>
                  <td>20일</td>
                  <td>3,670원</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>6개월</td>
                  <td>24,900원</td>
                  <td>30일</td>
                  <td>150일</td>
                  <td>15,560원</td>
                  <td>75% 환불</td>
                </tr>
                <tr>
                  <td>12개월</td>
                  <td>33,000원</td>
                  <td>30일</td>
                  <td>335일</td>
                  <td>15,140원</td>
                  <td>50% 환불</td>
                </tr>
              </tbody>
            </table>
            <h5>환불 예시</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
