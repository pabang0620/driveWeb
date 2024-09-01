import { useEffect, useRef, useState } from "react";
import Checkout from "./Checkout";

export default function Payment() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

        <button onClick={openModal} className="payment_button">
          멤버십 가입하기
        </button>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={closeModal} className="modal-close-button">
                ×
              </button>
              <Checkout />
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
              <tr>
                <td>3개월</td>
                <td>9,900원</td>
              </tr>
              <tr>
                <td>12개월</td>
                <td>39,600원 → 35,000원 (12% 할인)</td>
              </tr>
              <tr>
                <td>36개월</td>
                <td>118,800원 → 99,000원 (17% 할인)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="refund_policy">
          <h4>환불 정책</h4>
          <p>
            운행일지 환불 정책은
            <br className="mobile_br" />
            공정거래위원회 표준약관을 준수합니다.
            <br />
          </p>
          <p>
            환불과정에서 수수료가 발생한 경우
            <br className="mobile_br" />
            수수료 차감 후 환불 진행됩니다.
          </p>
          <ul>
            <li>
              3개월 요금 결제 후 7일이 지나지 않은 경우
              <br className="mobile_br" />
              잔여기간 요금 100% 환불
            </li>
            <li>
              3개월 요금 결제 후 7일이 지난 경우
              <br className="mobile_br" />
              잔여기간 요금 90% 환불
            </li>
            <li>
              12개월 요금 결제한 경우
              <br className="mobile_br" />
              잔여기간 요금 80% 환불
            </li>
            <li>
              36개월 요금 결제한 경우
              <br className="mobile_br" />
              잔여기간 요금 70% 환불
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
                  <td>3개월</td>
                  <td>9,900원</td>
                  <td>7일</td>
                  <td>83일</td>
                  <td>9,240원</td>
                  <td>100% 환불</td>
                </tr>
                <tr>
                  <td>3개월</td>
                  <td>9,900원</td>
                  <td>10일</td>
                  <td>80일</td>
                  <td>7,920원</td>
                  <td>90% 환불</td>
                </tr>
                <tr>
                  <td>12개월</td>
                  <td>35,000원</td>
                  <td>90일</td>
                  <td>275일</td>
                  <td>21,100원</td>
                  <td>80% 환불</td>
                </tr>
                <tr>
                  <td>36개월</td>
                  <td>99,000원</td>
                  <td>730일</td>
                  <td>365일</td>
                  <td>23,100원</td>
                  <td>70% 환불</td>
                </tr>
              </tbody>
            </table>
            <h5>환불 예시</h5>
          </div>
        </div>
      </div>
      <style jsx>{`
        .payment_container {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          ul,
          li,
          ol {
            list-style: none;
          }
          .mobile_br {
            display: none;
          }
          @media (max-width: 1024px) {
            width: 90%;
          }
          @media (max-width: 767px) {
            width: 85%;
            .mobile_br {
              display: block;
            }
          }
          .content {
            margin: 0 auto;
            border-radius: 4px;
            .payment_info {
              text-align: center;
              h3 {
                font-size: 35px;
                font-weight: 700;
                margin-bottom: 10px;
                color: #007bff;
                @media (max-width: 768px) {
                  font-size: 24px;
                  margin-bottom: 20px;
                }
              }

              p {
                font-size: 15px;
                line-height: 30px;
                color: #666;
                @media (max-width: 768px) {
                  font-size: 14px;
                  line-height: 22px;
                  margin-bottom: 10px;
                }
              }
            }
            .premium_benefits {
              width: 100%;
              margin: 0 auto;
              display: flex;
              justify-content: space-around;
              border: 1px solid #d9d9d9;
              margin-top: 50px;
              @media (max-width: 1024px) {
                width: 90%;
              }
              @media (max-width: 768px) {
                width: 50%;
                margin: 30px auto 0 auto;
                text-align: center;
                flex-direction: column;
                border: none;
                gap: 10px;
              }
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
                @media (max-width: 768px) {
                  width: 100%;
                  font-size: 12px;
                  padding: 3%;
                  gap: 5px;
                }
                .imgbox {
                  text-align: center;
                  font-size: 50px;
                  line-height: 98px;
                }
                &:not(:nth-of-type(3n)) {
                  border-right: 1px solid #d9d9d9;
                  @media (max-width: 768px) {
                    border: none;
                  }
                }
              }
            }

            .subscription_info {
              margin-top: 60px;
              text-align: center;
              h4 {
                font-size: 18px;
                font-weight: 700;
                color: #333;
                margin-bottom: 20px;
                span {
                  font-size: 15px;
                }
                @media (max-width: 768px) {
                  margin-bottom: 10px;
                }
              }
              table {
                width: 80%;
                margin: 0 auto;
                border-collapse: collapse;
                font-size: 12px;
                line-height: 18px;
                @media (max-width: 1024px) {
                  width: 70%;
                }
                @media (max-width: 768px) {
                  width: 100%;
                }
                th,
                td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: center;
                }
                th {
                  background-color: #f4f4f4;
                }
              }
            }
            .refund_policy {
              text-align: center;
              font-size: 14px;
              line-height: 25px;
              margin-top: 60px;
              h4 {
                font-size: 18px;
                line-height: 25px;
                font-weight: 700;
                color: #333;
                margin-bottom: 20px;
              }
              p,
              ul li {
                color: #666;
                @media (max-width: 768px) {
                  margin-bottom: 10px;
                  line-height: 20px;
                  font-size: 12px;
                }
              }
              ul {
                list-style-type: disc;
                margin-top: 20px;
              }
            }
            .refund_example {
              margin: 30px auto 0 auto;

              @media (max-width: 768px) {
                width: 100%;
              }
              h5 {
                font-size: 13px;
                line-height: 25px;
                text-align: right;
                color: #666;
                width: 85%;
                margin: 0 auto;
                @media (max-width: 1024px) {
                  width: 90%;
                }
                @media (max-width: 768px) {
                  font-size: 12px;
                  width: 100%;
                }
              }

              table {
                width: 85%;
                margin: 0 auto;
                white-space: nowrap;
                border-collapse: collapse;
                font-size: 12px;
                line-height: 18px;
                @media (max-width: 1024px) {
                  width: 90%;
                }
                @media (max-width: 768px) {
                  width: 100%;
                }
                th,
                td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: center;
                  @media (max-width: 768px) {
                    font-size: 11px;
                    line-height: 15px;
                  }
                }
                th {
                  background-color: #f4f4f4;
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
              @media (max-width: 1024px) {
                width: 50%;
              }
              @media (max-width: 767px) {
                width: 60%;
                margin: 60px auto 100px auto;
              }

              &:hover {
                background-color: #0056b3;
              }
              &:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba;
              }
            }
          }
          /*페이먼트 모달 */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
          }
          .modal-content {
            background: white;
            border-radius: 8px;
            width: 80%;
            height: 80%;
            overflow-y: scroll;
            max-width: 600px;
            position: relative;
            @media (max-width: 767px) {
              width: 85%;
              height: 85%;
            }
          }

          .modal-close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            border: none;
            background: none;
            font-size: 24px;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
}
